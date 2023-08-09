# Arachnida

Arachnida is a set of two programs Spider and Scorpion, both written in typescript and running in node.js

### Installation

```bash
npm install
```
## Spider

Spider can scrap images recursively from an url and download them locally.
Supported image types are: `jpg/jpeg`, `png`, `gif`, `bmp`

### Usage

```bash
npm run start:spider -- [OPTIONS] URL
```
#### Options

- `-r`, `--recursive` activates recursive mode

- `-l`, `--length` used in combination with `--recursive` to manually set the recursive depth (default value is 5)

- `-p`, `--path` used to manually set output directory (default value is 'dist/')

#### Example
```bash
npm run start:spider -- dist/images http://google.com
```
This will scrap all images from the page http://google.com and store them in dist/.
```bash
npm run start:spider -- -r -l 10 -p dist/images http://google.com
```
This will scrap all images recursively with a depth of 10 from http://google.com and store them in dist/images/.
## Scorpion

Scorpion can extract and display metadata from images

### Usage

```bash
npm run start:scorpion -- FILE1 [FILE2] ...
```

#### Example
```bash
npm run start:scorpion -- dist/*
```
This will extract and display metadata from all images inside `dist/` directory 