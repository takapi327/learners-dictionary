#!/bin/sh
echo remove dir and zip
rm -rf api-dist/
 
echo compile ts
tsc -p tsconfig.json
 
echo copy package.json
cp -f ./package.json ./api-dist
 
echo install module
cd api-dist
yarn install
 
echo zip 
zip -r api-dist.zip ./
