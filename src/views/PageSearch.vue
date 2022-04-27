<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query"></SearchInput>
    </div>
  </div>
</template>

<script>
import SearchInput from '@/components/Search/SearchInput'
import { ref, watch } from 'vue'
export default {
  name: 'page-search',
  components: {
    SearchInput
  },
  setup: function () {
    const query = ref('')

    watch(query, (val) => {
      console.log(val)
    })

    return {
      query
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variable.scss";
  .search {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .search-input-wrapper {
      margin: 20px;
    }
  }
</style>
