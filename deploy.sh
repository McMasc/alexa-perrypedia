#!/bin/sh
projectName=${PWD##*/} 
rm ../$projectName-upload.zip
zip -X -r ../$projectName-upload.zip *