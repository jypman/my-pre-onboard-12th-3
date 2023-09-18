# 프리온보딩 3주차 과제
## 🌐 배포 주소
### https://my-pre-onboard-12th-3.vercel.app/

## ⚙ 로컬 실행 방법

1. 프로젝트 내려받기 `git clone https://github.com/jypman/my-pre-onboard-12th-3.git ./`
2. 패키지 설치: `npm install`
3. 애플리케이션 실행: `npm start`
4. 테스트 코드 실행 `npm test`


## 🙋‍about me

| 박진영                                                                                            |
|------------------------------------------------------------------------------------------------|
| <img src="https://avatars.githubusercontent.com/u/69949824?v=4.png" width="300" height="300"/> |
| [닉네임 : jypman](https://github.com/jypman)|

## 💻 과제 요구사항
https://lean-mahogany-686.notion.site/Week-3-b318a3294a3648ff846f94db8661eca2

## 📁 프로젝트 디렉토리 구조
```
📁src
├── App.tsx
├── 📁api
│   ├── config.ts (api의 base url, end point 관리)
│   ├── http.ts (axios instance, 요청 에러 핸들링 관리)
│   └── sick.ts (질환명 추천 검색어 관련 리소스 요청 로직 관리)
├── 📁components (공용 UI 컴포넌트 관리)
│   ├── Icon.tsx
│   ├── SearchForm.tsx
│   ├── SearchedKeywordCard.tsx
│   └── SearchedKeywordItem.tsx
├── index.css
├── index.tsx
├── logo.svg
├── 📁pages (각 페이지를 렌더링하는 컴포넌트 관리)
│   ├── Home.tsx (홈 페이지 -> 질환명 검색 가능)
│   ├── NotFound.tsx (404에러 페이지)
│   ├── Routes.tsx (페이지 라우팅 관리)
│   └── SearchResult.tsx (검색 결과 페이지)
├── 📁providers (서버 상태값과 업데이트 함수를 react context api를 통해 제공하는 파일 관리)
│   └── SearchProvider.tsx
├── react-app-env.d.ts
├── reportWebVitals.ts
├── 📁server (서버 로직 관리)
│   └── 📁mocks (서버 모킹 관리)
│       ├── browser.ts (브라우저 실행 시 실행될 모킹 api)
│       ├── db.json (api 모킹 데이터)
│       └── sickKeywordHandler.ts (질환명 추천 검색어 모킹 api 처리 로직)
├── setupTests.ts
├── 📁tests
│   └── Home.test.tsx
└── 📁utils
    ├── cache.ts
    ├── localstorage.ts
    └── utils.ts
```

## 이 기능에 대해 고민해봤어요!
- **view(JSX)와 로직 관심사 분리**
  - <span style="color:green;font-weight:bold">why?</span>
    - 하나의 모듈을 수정하는 목적을 하나로 제한하기 위함
    - 모듈 수정 시 수정 목적을 파악하기 용이
    - 이를 통해 유지보수 용이
  - <span style="color:green;font-weight:bold">how?</span>
    - view는 Home.tsx에서 관리
    - 상태값과 상태값 업데이트 함수는 context api를 사용한 Providers 디렉토리의 ***Provider.tsx에서 제공
    - ***Provider.tsx의 자식 컴포넌트에 위치한 컴포넌트는 <br/> ***Provider.tsx에서 제공하는 커스텀훅을 import하여 상태값과 함수 사용가능
    - 만약 ***Provider.tsx의 자식이 아닌 컴포넌트가 ***Provider.tsx의 커스텀 훅을 사용할 경우 <br/>"<span style="color:red;font-weight:bold">[커스텀훅명] should be used within [provider명]</span>"<br/> 에러를 던져 실수를 방지하여 개발자 경험 개선 ([해당 디렉토리로 이동](./src/providers/))

 
- **API 호출별로 로컬 캐싱 구현**
  - <span style="color:green;font-weight:bold">how?</span>
    - axios instance에서 요청 시 해당 검색키워드 관련 추천 검색어들이 로컬 스토리지에 있는지 확인
    - 캐싱 만료기간이 지난 로컬 스토리지 데이터는 삭제
    - 해당 데이터가 로컬 스토리지에 있다면 캐싱 데이터를 리턴하고 그렇지 않으면 외부 리소스 리턴
    - 외부 리소스를 리턴할 때 로컬 스토리지에 해당 리소스를 저장한다.
    - 로컬 스토리지에 저장할 key는 "cached_keyword_" + <검색 키워드>
    - 로컬 스토리지에 저장할 value는 {data: <추천 검색어를 요소로 하는 배열>, expireTime: new Date().getTime()}을 저장
  - <span style="color:green;font-weight:bold">why?</span>
    - 로컬 스토리지의 경우 캐싱할 데이터를 저장 후 사이트를 나간 뒤 다시 접속해도 캐싱한 데이터가 보존되기에 지속 가능한 캐싱이 가능하며 원하는 기간의 만료 기능 구현 가능
    - 반면, 세션 스토리지의 경우 사이트를 나가면 캐싱한 데이터가 사라지는 휘발성으로 인해 캐싱 만료 기능을 구현하기 힘들기 때문에 로컬스토리로 캐싱을 구현
    - [참고 파일로 이동](./src/api/http.ts)


- **입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립**
  - <span style="color:green;font-weight:bold">how?</span>
    - 디바운싱으로 해결
  - <span style="color:green;font-weight:bold">why?</span>
    - 디바운싱이란? 연속으로 호출되는 로직 중에서 마지막 호출만 로직이 실행되도록 하는 것을 의미
    - 텍스트 입력마다 API가 호출되기에 연속된 텍스트 입력 후 마지막 텍스트를 기준으로 API 호출
    - 연속된 불필요한 요청 취소 및 서버 리소스 절약에 용이
    - [debounce 함수로 이동](https://github.com/jypman/my-pre-onboard-12th-3/blob/main/src/utils/utils.ts#L1-L7)
    - [debouncedUpdateSearchList 함수로 이동](https://github.com/jypman/my-pre-onboard-12th-3/blob/main/src/providers/SearchProvider.tsx#L165-L167)


- **키보드만으로 추천 검색어들로 이동 가능하도록 구현**
  - <span style="color:green;font-weight:bold">how?</span>
    - 검색창이 열린 상태에서 검색어를 입력할 경우 keydown 이벤트를 감지합니다.
    - keydown 이벤트 감지후 event.isComposing일 경우 추천 검색어들로 이동가능하도록 하는 로직을 종료
    - keydown 이벤트가 방향키 상하일 경우 포커싱될 추천 검색어 목록의 인덱스를 상태 값으로 저장
    - 현재 포커싱된 추천 검색어 목록에 background-color 부여하여 사용자에게 포커싱 정보를 공유
    - 포커싱 후 검색어 인풋에 해당 추천 검색어로 값이 변경
    - 엔터 시 해당 검색 결과 페이지로 이동
  - <span style="color:green;font-weight:bold">why?</span>
    - keypress 이벤트의 경우 방향키 입력 이벤트를 리스닝할 수 없기 때문에 keydown이벤트를 감지하도록 설정
    - event.isComposing일 경우 추천 검색어들로 이동가능하도록 하는 로직을 종료하는 이유?
      - event.isComposing이 true일 때 방향키를 입력해도 검색어를 입력하는 이벤트로 감지하기 때문에 기존 추천 검색어 목록이 업데이트되기 때문입니다.
    - [추천 검색어 이동 로직으로 이동](https://github.com/jypman/my-pre-onboard-12th-3/blob/main/src/providers/SearchProvider.tsx#L99-L140)


- **테스트코드 추가**
  - <span style="color:green;font-weight:bold">why?</span>
    - 구현한 기능이 의도된대로 동작하는지 빠른 피드백이 가능
    - 해당 기능 정상작동의 확신 갖기 위함
  - <span style="color:green;font-weight:bold">how?</span>
    - jest 및 React Testing Library로 진행
    - 필수 구현 사항을 중점적으로 테스트 케이스 추가
    - [참고 디렉토리로 이동](./src/tests/)


- **서버 모킹**
  - <span style="color:green;font-weight:bold">how?</span>
    - msw(mock server worker) 라이브러리를 통한 모킹 api 구축
  - <span style="color:green;font-weight:bold">why?</span>
    - 해당 라이브러리의 경우 모킹 서버를 따로 띄울 필요가 없기에 간편
    - `npm start` 시 index.tsx와 함께 msw의 서비스 워커가 실행되어 api 요청에 대한 모킹 데이터 응답 준비 완료
    - [참고 파일로 이동](./src/index.tsx)

## 🛠사용한 라이브러리
<div>

영역|목록|
:--------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
**Frontend** | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img alt="Static Badge" src="https://img.shields.io/badge/Axios-%235A29E4?style=for-the-badge&logo=axios&logoColor=white"> <img alt="Static Badge" src="https://img.shields.io/badge/Mock%20Server%20Worker-rgb(255%2C%20106%2C%2051)?style=for-the-badge&logo=msw&logoColor=white"> <img alt="Static Badge" src="https://img.shields.io/badge/Jest-%23C21325?style=for-the-badge&logo=Jest&logoColor=white"> <img alt="Static Badge" src="https://img.shields.io/badge/Testing%20Library-%23E33332?style=for-the-badge&logo=Testing%20Library&logoColor=white"> <img src="https://img.shields.io/badge/styledcomponents-DB7093.svg?&style=for-the-badge&logo=styledcomponents&logoColor=white"> <img src="https://img.shields.io/badge/React Router-CA4245.svg?&style=for-the-badge&logo=reactrouter&logoColor=white"> 
</div>