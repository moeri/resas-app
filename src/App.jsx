import './App.css';
import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import apiKey from './apiKey';

export const App = () => {
  // 都道府県ごとにチェックされたかどうかを保持する配列
  const [selected, setSelected] = useState(Array(47).fill(false));

  // 都道府県の一覧を取得するAPIのレスポンスを保持するオブジェクト
  const [prefectures, setPrefectures] = useState({});

  // Highchartsに表示するデータの配列
  const [series, setSeries] = useState([]);

  const startyear = 1980;

  // チェックボックスの選択状態を反転する関数
  const changeSelection = (index) => {
    const selectedCopy = selected.slice();
    selectedCopy[index] = !selectedCopy[index];
    setSelected(selectedCopy);

    if (!selected[index]) {
      // チェックされていなかった場合はデータを取得するAPIを呼び出す
      fetch(`https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${index + 1}`, {
        headers: { 'X-API-KEY': apiKey }
      })
      .then(response => response.json())
      .then(res => {
        const boundaryyear = Number(res.result.boundaryYear);
        console.log(boundaryyear)
        const i = (boundaryyear - startyear) / 5 + 1
        const data = res.result.data[0].data.map((d) => d.value);
        const resSeries = {
          name: prefectures[index].prefName,
          data: data.slice(0, i)
        };
        setSeries([...series, resSeries]);
      });
    } else {
      // チェック済みの場合はデータを配列から削除する
      const seriesCopy = series.slice();
      for (let i = 0; i < seriesCopy.length; i++) {
        if (seriesCopy[i].name === prefectures[index].prefName) {
          seriesCopy.splice(i, 1);
        }
      }
      setSeries(seriesCopy);
    }
  };

  // ページがロードされた時に都道府県の一覧を取得するAPIを呼び出す
  useEffect(() => {
    fetch('https://opendata.resas-portal.go.jp/api/v1/prefectures', {
      headers: { 'X-API-KEY': apiKey }
    })
      .then(response => response.json())
      .then(res => {
        setPrefectures(res.result);
      });
  }, []);

  // チェックボックスを描画する関数
  const renderItem = (props) => {
    return (
      <div key={props.prefCode} style={{ margin: '5px', display: 'inline-block' }}>
        <input
          type="checkbox"
          checked={selected[props.prefCode - 1]}
          onChange={() => changeSelection(props.prefCode - 1)}
        />
        {props.prefName}
      </div>
    );
  };

  // Highchartsに渡すオプションのオブジェクト
  const options = {
    title : {
      text: null
    },
    xAxis : {
      title: {text: "年度"}
    },
    yAxis : {
      title: {text: "人口数"}
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        pointInterval: 5,
        pointStart: startyear,
      },
    },
    series: series,
  };

  Highcharts.setOptions({
    lang: {
      numericSymbols: null,
    },
  })
  
  return (
    <div>
      <h1>都道府県別の総人口推移グラフ</h1>
      <h2>都道府県</h2>
      {Object.keys(prefectures).map((i) => renderItem(prefectures[i]))}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
