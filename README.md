# recoil-study

# Recoil Docs

https://recoiljs.org/ko/docs/introduction/motivation

# 등장 배경

호환성 및 단순함을 이유로 외부의 글로벌 상태관리 라이브러리보다는 React 자체에 내장된 상태 관리 기능을 사용하는 것이 가장 좋다. 그러나 React는 다음과 같은 한계가 있다.

- 컴포넌트의 상태는 공통된 상위요소까지 끌어올려야만 공유될 수 있으며, 이 과정에서 거대한 트리가 다시 렌더링되는 효과를 야기하기도 한다.

- Context는 단일 값만 저장할 수 있으며, 자체 소비자(consumer)를 가지는 여러 값들의 집합을 담을 수는 없다.

이 두 가지 특성이 트리의 최상단(state가 존재하는 곳)부터 트리의 말단(state가 사용되는 곳)까지의 코드 분할을 어렵게 한다.

## Recoil 특성

- recoie은 공유상태(shared state)도 React의 내부상태(local state)처럼 간단한 get/set 인터페이스로 사용할 수 있도록 boilerplate-free API를 제공한다. (필요한 경우 reducers 등으로 캡슐화할 수도 있다.)

- 우리는 동시성 모드(Concurrent Mode)를 비롯한 다른 새로운 React의 기능들과의 호환 가능성도 갖는다.

- 상태 정의는 점진적이고(incremental) 분산되어 있기 때문에, 코드 분할이 가능하다.

- 상태를 사용하는 컴포넌트를 수정하지 않고도 상태를 파생된 데이터로 대체할 수 있다.

- 파생된 데이터를 사용하는 컴포넌트를 수정하지 않고도 파생된 데이터는 동기식과 비동기식 간에 이동할 수 있다.

- 우리는 탐색을 일급 개념으로 취급할 수 있고 심지어 링크에서 상태 전환을 인코딩할 수도 있다.

- 전체 애플리케이션 상태를 하위 호환되는 방식으로 유지하기가 쉬우므로, 유지된 상태는 애플리케이션 변경에도 살아남을 수 있다.

# 주요 개념

Recoil을 사용하면 atoms(공유 상태)에서 selectors(순수 함수)를 거쳐 React 컴포넌트로 내려가는 data-flow graph를 만들 수 있다. Atoms는 컴포넌트가 구독할 수 있는 상태의 단위다. Selectors는 atoms 상태값을 동기 또는 비동기 방식을 통해 변환한다.

## Atoms

Atoms는 상태의 단위이며, 업데이트와 구독이 가능하다. atom이 업데이트되면 각각의 구독된 컴포넌트는 새로운 값을 반영하여 다시 렌더링 된다. atoms는 런타임에서 생성될 수도 있다. Atoms는 React의 로컬 컴포넌트의 상태 대신 사용할 수 있다. 동일한 atom이 여러 컴포넌트에서 사용되는 경우 모든 컴포넌트는 상태를 공유한다.

```js
const fontSizeState = atom({
  key: "fontSizeState",
  default: 14,
});
```

컴포넌트에서 atom을 읽고 쓰려면 useRecoilState라는 훅을 사용한다. React의 useState와 비슷하지만 상태가 컴포넌트 간에 공유될 수 있다는 차이가 있다.

```js
function FontButton() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  return (
    <button onClick={() => setFontSize((size) => size + 1)} style={{ fontSize }}>
      Click to Enlarge
    </button>
  );
}
```

## Selectors

Selector는 atoms나 다른 selectors를 입력으로 받아들이는 순수 함수(pure function)다. 상위의 atoms 또는 selectors가 업데이트되면 하위의 selector 함수도 다시 실행된다. 컴포넌트들은 selectors를 atoms처럼 구독할 수 있으며 selectors가 변경되면 컴포넌트들도 다시 렌더링된다.

Selectors는 상태를 기반으로 하는 파생 데이터를 계산하는 데 사용된다. 최소한의 상태 집합만 atoms에 저장하고 다른 모든 파생되는 데이터는 selectors에 명시한 함수를 통해 효율적으로 계산함으로써 쓸모없는 상태의 보존을 방지한다.

```js
const fontSizeLabelState = selector({
  key: "fontSizeLabelState",
  get: ({ get }) => {
    const fontSize = get(fontSizeState);
    const unit = "px";

    return `${fontSize}${unit}`;
  },
});
```

get 속성은 계산될 함수다. 전달되는 get 인자를 통해 atoms와 다른 selectors에 접근할 수 있다. 다른 atoms나 selectors에 접근하면 자동으로 종속 관계가 생성되므로, 참조했던 다른 atoms나 selectors가 업데이트되면 이 함수도 다시 실행된다.

Selectors는 useRecoilValue()를 사용해 읽을 수 있다. useRecoilValue()는 하나의 atom이나 selector를 인자로 받아 대응하는 값을 반환한다. fontSizeLabelState selector는 writable하지 않기 때문에 useRecoilState()를 이용하지 않는다. (writable한 selectors에 대한 더 많은 정보는 selector API reference에 자세히 기술되어 있다.)

```js
function FontButton() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  const fontSizeLabel = useRecoilValue(fontSizeLabelState);

  return (
    <>
      <div>Current font size: ${fontSizeLabel}</div>

      <button onClick={setFontSize(fontSize + 1)} style={{fontSize}}>
        Click to Enlarge
      </button>
    </>

```
