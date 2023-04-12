import React, { useEffect } from 'react';
import { TFilterType, TSGGType } from '../type/types';
import axios from 'axios';

type PMyFilterSettingProps = {
  filterList: TFilterType[];
};

function MyFilterSetting(): JSX.Element {
  const [sgg, setSGG] = React.useState<TSGGType[]>([]);

  var errCnt = 0;

  useEffect(() => {
    getAccessToken();
  }, []);

  const getAccessToken = async () => {
    await axios
      .get('https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json', {
        params: {
          consumer_key: '2ebdf6cf7ddd4eafa284',
          consumer_secret: 'ee54d708b71e4eac905c',
        },
      })
      .then(res => {
        console.log(res.data.result);
        const accessToken = res.data.result.accessToken;
        console.log(accessToken);
        getSGG(accessToken);
      })
      .catch(e => console.log(e));
  };

  const getSGG = async (token: string) => {
    await axios
      .get('https://sgisapi.kostat.go.kr/OpenAPI3/addr/stage.json', {
        params: {
          accessToken: token,
          pg_yn: '0',
        },
      })
      .then(res => {
        const { data } = res;
        console.log(data);
        switch (parseInt(data.errCd)) {
          case 0:
            var totalcount = data.result.totalcount;
            for (var i = 0; i < data.result.resultdata.length; i++) {
              var resultdata = data.result.resultdata[i];
              var x = resultdata.x;
              var y = resultdata.y;
            }
            break;
          case -401:
            errCnt++;
            if (errCnt < 200) {
              getAccessToken();
            }
            break;
          case -100:
            break;
        }
      })
      .catch(error => console.log(error));
  };

  return (
    <section className="filter-select-form-wrapper">
      <form id="filter-form">
        <h2>내 필터 설정</h2>
        <label className="basic-input-label">지역</label>
        <select className="basic-input">
          <option>시/도</option>
        </select>

        <select className="basic-input">
          <option>구/군</option>
        </select>

        <select className="basic-input">
          <option>읍/면/동</option>
        </select>
        <input
          type="text"
          className="basic-input"
          placeholder="나머지주소 직접입력"
        />

        <div>
          <label className="basic-input-label">
            종류
            <select className="basic-input" id="ctgrHirkId">
              <option>전체</option>
              <option>주거용</option>
              <option>업무용</option>
              <option>토지</option>
              <option>기타</option>
            </select>
          </label>

          <label className="basic-input-label">
            세부종류
            <select className="basic-input" id="ctgrHirkIdMid">
              <option>전체</option>
            </select>
          </label>
        </div>

        <div>
          <label className="basic-input-label">
            대지면적
            <input className="basic-input" type="number" />
            <span>㎡ / </span>
          </label>

          <label className="basic-input-label">
            건물면적
            <input className="basic-input" type="number" />
            <span>㎡</span>
          </label>
        </div>

        <div>
          <label className="basic-input-label">
            감정가
            <input className="basic-input" type="text" />
          </label>
          <label className="basic-input-label">
            최저가
            <input className="basic-input" type="text" />
          </label>
        </div>
      </form>
      <input
        type={'submit'}
        value="필터 추가"
        className="basic-submit-button"
      />
    </section>
  );
}

export default MyFilterSetting;
