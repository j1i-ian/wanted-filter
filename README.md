
# Wanted Filter

구직 사이트 Wanted job poster filtering 을 위해 제작되었음.

## Database

local storage 는 json data size 에 따라 다소 차이가 있겠지만 약 3000개 정도를 넘어가면 성능 이슈가 발생하므로

IndexedDB 를 사용합니다.

# Requirements

* Inspector 띄우는 중 탭 이동을 하면 꺼짐.
* 숨기기 버튼 민감도가 너무 커 취소 snackbar 를 어떻게 띄울 것인가 고민해봐야함
    * 하지만 여러 구직 사이트를 지원한다고 생각할 경우 플랫폼 의존도를 멀리하는 게 좋겠다고 보여져 순수 CSS 로 Div popup + Fade in/out 을 활용해야할 듯.
* 현재는 원티드만 된다. 잡코리아 지원 예정.
* 회사 단위로 숨기기 기능을 구현했지만 구직건 단위로 해야할지 고민
    * 사명을 바꿔서 포스팅을 하는 등의 경우를 고려하면 그다지 필요 없을 것으로 생각됨.
    * 2~3주 관찰 후 문제 없다고 생각되면 해당 요구사항은 해결된 것으로

## Solved Requirements

* Infinity Scrolling 중 새로 추가되는 Component 에 대해 어떻게 추가할 것인가
    * 어차피 Loading timing 잡는데 쓰였는데 Mutation Observer 를 활용하면 해당 문제도 해결될 뿐더러 DOM 에 대한 일관적인 작동이 보장되니 일타삼피.
* 보기 좋은 떡이 먹기도 좋다고 숨기기 버튼 Design 은 플랫폼 종속을 따른다.
    * 어차피 Web UI Component 들은 대부분 정형화되서 바뀌는 경우도 별로 없음.
