#!/usr/bin/env python3

import os
import re
from os import path
from subprocess import PIPE, Popen

os.chdir(path.dirname(path.abspath(__file__)))


def tinyhtml(text):
    lines = re.split('(<[^>]+>)', text)
    rv = []
    for line in lines:
        line = line.strip()
        rv.append(line)
    return ''.join(rv)


def shell(cmd, data=None):
    p = Popen(cmd, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    if isinstance(data, str):
        data = data.encode('utf-8')
    stdout, stderr = p.communicate(input=data)
    if stderr:
        raise RuntimeError(stderr)
    return stdout.decode('utf-8')


class GenFiles:

    def __init__(self):
        print('Generting dist files...')
        self.mode = 'dist'
        self.output_dir = 'dist'

    def create_card(self, theme):
        with open('src/theme/%s.html' % theme) as f:
            template = f.read()
            start = template.find('<script')
            end = template.find('</script>') + len('</script>')
            template = template[start:end]

        html = (
            '<!doctype html><html><body>'
            '<style type="text/css">%s</style>%s'
            '<script>%s</script>'
            '</body></html>'
        )

        css = shell(['cleancss', 'src/theme/%s.css' % theme])

        with open('src/card.js', 'r') as f:
            content = f.read()
            # use real API url
            content = content.replace(
                'http://localhost:8001', 'https://douban-card.info:8443')

        js = shell(['uglifyjs', '-m'], content)

        out = html % (css, tinyhtml(template), js)
        with open(f'{self.output_dir}/theme/%s.html' % theme, 'w') as f:
            f.write(out)

    def create_widget(self):
        url = (f'https://laike9m.github.io/douban-card/{self.output_dir}/')

        with open('src/widget.js') as f:
            content = f.read()
            content = content.replace('replacethis', url)

        js = shell(['uglifyjs', '-m'], content)
        with open(f'{self.output_dir}/widget.js', 'w') as f:
            f.write(js)


def main():
    if not os.path.isdir('dist/theme'):
        os.makedirs('dist/theme')

    g = GenFiles()
    g.create_widget()
    g.create_card('douban')


if __name__ == '__main__':
    main()
