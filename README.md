# 프리온보딩 3주차 과제

## 이름
- 박진영

## 배포 주소
- https://my-pre-onboard-12th-3.vercel.app/

## 필수 기능 구현 목록
- https://lean-mahogany-686.notion.site/Week-3-b318a3294a3648ff846f94db8661eca2

## 이 기능에 대해 고민해봤어요!
- API 호출별로 로컬 캐싱 구현
  - <span style="color:green;font-weight:bold">how?</span>
    - axios instance에서 요청 시 해당 검색키워드 관련 추천 검색어들이 로컬 스토리지에 있는지 확인
    - 캐싱 만료기간이 지난 로컬 스토리지 데이터는 삭제
    - 해당 데이터가 로컬 스토리지에 있다면 캐싱 데이터를 리턴하고 그렇지 않으면 외부 리소스 리턴
    - 외부 리소스를 리턴할 때 로컬 스토리지에 해당 리소스를 저장한다.
    - 로컬 스토리지에 저장할 key는 "cached_sick_keyword_" + <검색 키워드>
    - 로컬 스토리지에 저장할 value는 {data: <검색어를 포함한 질환명을 요소로 하는 배열>, expireTime: new Date().getTime()}을 저장
  - <span style="color:green;font-weight:bold">why?</span>
    - 로컬 스토리지의 경우 캐싱할 데이터를 저장 후 탭을 나간 뒤 해당 탭으로 다시 접속하면 캐싱한 데이터가 보존되어 있으며 지속 가능한 캐싱이 가능하며 원하는 기간의 만료 기능을 구현할 수 있습니다.
    - 반면, 세션 스토리지의 경우 탭을 나가면 캐싱한 데이터는 사라지는 휘발성으로 인해 특정 만료기간 기능을 구현하기 힘들기 때문에 로컬스토리로 캐싱을 구현하였습니다.


- 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립
  - <span style="color:green;font-weight:bold">how?</span>
    - 디바운싱으로 해결
  - <span style="color:green;font-weight:bold">why?</span>
    - 디바운싱이란? 연속으로 호출되는 로직 중에서 마지막 호출만 로직이 실행되도록 하는 것을 의미
    - 텍스트 입력마다 API가 호출되기에 연속된 텍스트 입력 후 마지막 텍스트를 기준으로 API가 호출되도록 하여
    - 불필요한 요청 및 서버 리소스 절약에 용이
  

- 키보드만으로 추천 검색어들로 이동 가능하도록 구현
  - <span style="color:green;font-weight:bold">how?</span>
    - 검색창이 열린 상태와 검색어를 입력할 경우 keydown 이벤트를 감지합니다.
    - keydown 이벤트 감지후 event.isComposing일 경우 추천 검색어들로 이동가능하도록 하는 로직을 종료
    - keydown 이벤트가 방향키 상하일 경우 포커싱될 추천 검색어 목록의 인덱스를 상태 값으로 저장
    - 현재 포커싱된 추천 검색어 목록에 background-color 부여하여 사용자에게 포커싱 정보를 공유
    - 포커싱 후 검색어 인풋에 해당 추천 검색어로 값이 변경
  - <span style="color:green;font-weight:bold">why?</span>
    - keypress 이벤트의 경우 방향키 입력 이벤트를 리스닝할 수 없기 때문에 keydown이벤트를 감지하도록 설정
    - event.isComposing일 경우 추천 검색어들로 이동가능하도록 하는 로직을 종료하는 이유?
      - event.isComposing이 true일 때 방향키를 입력해도 검색어를 입력하는 이벤트로 감지하기 때문에 기존 추천 검색어 목록이 업데이트되기 때문입니다.