import "./App.css";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import apiKey from "./apiKey";

const App = () => {
  // 都道府県ごとにチェックされたかどうかを保持する配列
  const [selected, setSelected] = useState(Array(47).fill(false));

  // 都道府県の一覧を取得するAPIのレスポンスを保持するオブジェクト
  const [prefectures, setPrefectures] = useState({});

  // Highchartsに表示するデータの配列
  const [series, setSeries] = useState([]);

  // APIで取得できる最も昔の年
  const startyear = 1980;

  // クリック時にチェックボックスの選択状態を反転する関数
  const changeSelection = (index) => {
    const selectedCopy = selected.slice();
    selectedCopy[index] = !selectedCopy[index];
    setSelected(selectedCopy);

    if (!selected[index]) {
      // チェックされていなかった場合はデータを取得するAPIを呼び出す
      fetch(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${
          index + 1
        }`,
        {
          headers: { "X-API-KEY": apiKey },
        }
      )
        .then((response) => response.json())
        .then((res) => {
          // 実績値と推計値の区切り年
          const boundaryyear = Number(res.result.boundaryYear);
          const i = (boundaryyear - startyear) / 5 + 1;

          const data = res.result.data[0].data.map((d) => d.value);
          const resSeries = {
            name: prefectures[index].prefName,
            data: data.slice(0, i),
          };
          setSeries([...series, resSeries]);
        });
    } else {
      // チェック済みの場合はデータを配列から削除する
      const seriesCopy = series.slice();
      for (let i = 0; i < seriesCopy.length; i += 1) {
        if (seriesCopy[i].name === prefectures[index].prefName) {
          seriesCopy.splice(i, 1);
        }
      }
      setSeries(seriesCopy);
    }
  };

  // ページがロードされた時に都道府県の一覧を取得するAPIを呼び出す
  useEffect(() => {
    fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
      headers: { "X-API-KEY": apiKey },
    })
      .then((response) => response.json())
      .then((res) => {
        setPrefectures(res.result);
      });
  }, []);

  // チェックボックスを描画する関数
  const renderItem = (props) => {
    return (
      <div
        key={props.prefCode}
        style={{ margin: "5px", display: "inline-block" }}
      >
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
    title: {
      text: null,
    },
    xAxis: {
      title: {
        text: "年度",
        align: "high",
      },
    },
    yAxis: {
      title: {
        text: "人口数",
        align: "high",
      },
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointInterval: 5,
        pointStart: startyear,
      },
    },
    series,
  };

  Highcharts.setOptions({
    lang: {
      numericSymbols: null,
    },
  });

  return (
    <div>
      <h1>都道府県別の総人口推移グラフ</h1>
      <h2>都道府県</h2>
      {Object.keys(prefectures).map((i) => renderItem(prefectures[i]))}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
App.propTypes = {
  prefCode: PropTypes.string,
  prefName: PropTypes.string,
};
App.defaultProps = {
  prefCode: null,
  prefName: null,
};
export default App;
