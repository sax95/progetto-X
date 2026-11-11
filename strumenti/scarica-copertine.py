#!/usr/bin/env python3
"""Scarica in locale le immagini remote usate nelle pagine HTML e aggiorna i riferimenti.

Uso (dalla cartella del sito):
    python3 strumenti/scarica-copertine.py            # scarica e riscrive gli HTML
    python3 strumenti/scarica-copertine.py --prova    # mostra cosa farebbe, senza toccare nulla

Le immagini vanno in img/copertine/. Se è installato Pillow vengono convertite in WebP.
Scarica solo immagini che hai il diritto di usare: molte copertine appartengono agli editori.
"""
import argparse, os, re, sys, urllib.request, urllib.parse, hashlib

IMG_TAG = re.compile(r'<img\b[^>]*>', re.I)
SRC = re.compile(r'\bsrc="(https?://[^"]+)"', re.I)
ALT = re.compile(r'\balt="([^"]*)"', re.I)
EXT = {'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif'}

def slug(text):
    text = re.sub(r'^(Copertina( italiana)? di)\s+', '', text, flags=re.I).lower()
    text = re.sub(r'[^a-z0-9]+', '-', text).strip('-')
    return text or 'copertina'

def scarica(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (scarica-copertine)'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read(), r.headers.get_content_type()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--prova', action='store_true')
    ap.add_argument('--cartella', default='img/copertine')
    args = ap.parse_args()
    try:
        from PIL import Image  # facoltativo
        import io
    except ImportError:
        Image = None
    pagine = [f for f in os.listdir('.') if f.endswith('.html')]
    fatto = {}   # url -> percorso locale
    errori = []
    for pagina in pagine:
        html = open(pagina, encoding='utf-8').read()
        nuovo = html
        for tag in IMG_TAG.findall(html):
            m = SRC.search(tag)
            if not m: continue
            url = m.group(1)
            if url not in fatto:
                alt = ALT.search(tag)
                nome = slug(alt.group(1) if alt else os.path.basename(urllib.parse.urlparse(url).path))
                nome += '-' + hashlib.md5(url.encode()).hexdigest()[:6]
                if args.prova:
                    fatto[url] = f'{args.cartella}/{nome}.webp'
                    print('scaricherei', url, '->', fatto[url]); continue
                try:
                    dati, tipo = scarica(url)
                    estensione = EXT.get(tipo, '.jpg')
                    if Image is not None:
                        im = Image.open(io.BytesIO(dati)).convert('RGB')
                        if im.width > 800: im = im.resize((800, round(im.height * 800 / im.width)))
                        percorso = f'{args.cartella}/{nome}.webp'
                        os.makedirs(args.cartella, exist_ok=True); im.save(percorso, 'WEBP', quality=82)
                    else:
                        percorso = f'{args.cartella}/{nome}{estensione}'
                        os.makedirs(args.cartella, exist_ok=True); open(percorso, 'wb').write(dati)
                    fatto[url] = percorso; print('ok', percorso)
                except Exception as e:
                    errori.append((url, str(e))); print('ERRORE', url, e, file=sys.stderr); continue
            nuovo = nuovo.replace(f'src="{url}"', f'src="{fatto[url]}"')
        if nuovo != html and not args.prova:
            open(pagina, 'w', encoding='utf-8').write(nuovo); print('aggiornato', pagina)
    print(f'\n{len(fatto)} immagini, {len(errori)} errori.')
    if errori: sys.exit(1)

if __name__ == '__main__':
    main()
