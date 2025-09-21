# Vue 3 Composition API 완벽 가이드

> Vue 3의 Composition API로 더 깔끔하고 재사용 가능한 코드 작성하기

## 🎯 개요

Vue 3에서 도입된 Composition API는 로직을 더 체계적으로 구성할 수 있게 해주는 새로운 API입니다. Options API의 한계를 극복하고 TypeScript와의 호환성을 크게 개선했습니다.

## 📚 기본 개념

### setup() 함수

Composition API의 진입점인 setup() 함수입니다.

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">증가</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    const increment = () => {
      count.value++
    }
    
    return {
      count,
      increment
    }
  }
}
</script>
```

### Reactive References

```javascript
import { ref, reactive, computed } from 'vue'

export default {
  setup() {
    // ref로 반응형 데이터 생성
    const count = ref(0)
    const name = ref('Vue')
    
    // reactive로 객체 반응형 생성
    const state = reactive({
      user: {
        name: 'John',
        age: 25
      }
    })
    
    // computed 속성
    const doubleCount = computed(() => count.value * 2)
    
    return { count, name, state, doubleCount }
  }
}
```

## 🔧 고급 활용

### Composables 패턴

재사용 가능한 로직을 composables로 분리합니다.

```javascript
// composables/useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count: readonly(count),
    increment,
    decrement,
    reset
  }
}
```

### Lifecycle Hooks

```javascript
import { onMounted, onUnmounted, onUpdated } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('컴포넌트가 마운트되었습니다')
    })
    
    onUpdated(() => {
      console.log('컴포넌트가 업데이트되었습니다')
    })
    
    onUnmounted(() => {
      console.log('컴포넌트가 언마운트되었습니다')
    })
  }
}
```

## 🚀 실전 팁

1. **TypeScript와 함께 사용**: Composition API는 TypeScript와 완벽하게 호환됩니다.
2. **로직 분리**: 관련된 로직을 함께 그룹화하여 가독성을 높이세요.
3. **Composables 활용**: 공통 로직은 composables로 분리하여 재사용하세요.

## 📝 마무리

Composition API는 Vue 3의 핵심 기능으로, 더 유연하고 강력한 컴포넌트 작성을 가능하게 합니다. 기존 Options API와 함께 사용할 수 있어 점진적 마이그레이션도 가능합니다.
