# arknights data

arknights data parser and build tools

## usage

### requirement

- [imagemagick 7.x](https://imagemagick.org/script/download.php)
- nodejs v8.x or newer
- yarn
- git
- ffmpeg
- [AssetStudio](https://ci.appveyor.com/project/Perfare/assetstudio/branch/master/artifacts) ([src](https://github.com/Perfare/AssetStudio))
- <s>[uTinyRipper](https://sourceforge.net/projects/utinyripper/files/) ([src](https://github.com/mafaca/UtinyRipper))</s> (included)

### install

```bash
mkdir tmp
cd tmp
git clone https://github.com/Perfare/ArknightsGameData.git
cd ..
# make your symlink to AssetStudio output folder
# windows: mklink /j e:\dev\arks\tmp\DB e:\dev\arknights\DB
ln -s path/to/asset/folder DB
yarn
yarn build
```

### upload (sync)

edit your .env file (you can find this info in your cookie of wiki)

```bash
cp .env.example .env
vim .env
```

for example:
```
user=12*74
session=o2mqh************89nc9fo
```

then enter
```bash
yarn sync
yarn sync map
yarn sync book
```

### all commands
```bash
# build
yarn build
yarn build char
yarn build map
yarn build skill
yarn build cv
yarn build item

# default+char+map+skill+cv+item
yarn build all

# module manage
yarn sync pull
yarn sync push

# upload
yarn sync
yarn sync char
yarn sync itemimg
yarn sync map
yarn sync cv
yarn sync skillimg
yarn sync book
yarn sync enemy
yarn sync stage
yarn sync tab

# default+char+itemimg+map+cv+skillimg+book+enemy+stage+tab
yarn sync all

# other
yarn sync purge

```


## others

头像文件
https://ak-data.mooncell.wiki/assets/arts/avatar_hub.ab

肖像文件
https://ak-data.mooncell.wiki/assets/arts/characters/chr_portraits_hub.ab