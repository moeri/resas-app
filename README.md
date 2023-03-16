# 都道府県別の総人口推移グラフ

## Description

RESAS-APIを用いたSPAです。
1. RESAS(地域経済分析システム) APIの「都道府県一覧」からAPIを取得
2. APIレスポンスから都道府県一覧のチェックボックスを動的に生成
3. 都道府県にチェックを入れると、RESAS APIから選択された都道府県の「人口構成」を取得
4. 人口構成APIレスポンスから、X軸:年、Y軸:人口数の折れ線グラフを動的に生成し表示


## Requirement

* node.js v18.14.2
* react v18.2.0
* highcharts v10.3.3
* eslint v8.35.0
* prettier v2.8.4

## Installation

```bash
npx create-react-app folder_name
npm install eslint --save-dev
npm install prettier --save-dev
```

## Note

* スマホ表示（480px以下）の際、都道府県チェックボックスを縦に並べると見づらいと感じたため、横スクロールにしました。


## Author

* 荒井 萌里
* moeri0428.oo@icloud.com