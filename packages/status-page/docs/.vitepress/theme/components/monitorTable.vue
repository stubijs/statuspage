<script setup lang="ts">
import { AgGridVue } from '@ag-grid-community/vue3' // the AG Grid Vue Component
import { reactive, ref } from 'vue'
import '@ag-grid-community/core/dist/styles/ag-grid.css' // Core grid CSS, always needed
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css' // Optional theme CSS
import { dataTable } from './../utils/data'

const props = defineProps({
  svgData: Object,
})

const finData = dataTable(props.svgData)

const gridApi = ref(null) // Optional - for accessing Grid's API

// Obtain API from grid's onGridReady event
const onGridReady = (params) => {
  gridApi.value = params.api
}

const rowData = finData // Set rowData to Array of Objects, one Object per Row

// Each Column Definition results in one Column.
const columnDefs = reactive({
  value: [
    { field: 'region', headerName: 'Region' },
    { field: 'city', headerName: 'City' },
    { field: 'a', headerName: 'avg. TTFB' },
    { field: 'msMin', headerName: 'min. TTFB' },
    { field: 'msMax', headerName: 'max. TTFB' },
    { field: 'n', headerName: 'Number of Tests' },
  ],
})

// DefaultColDef sets props common to all Columns
const defaultColDef = {
  sortable: true,
  filter: true,
}
</script>

<template>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="height: 500px"
    :column-defs="columnDefs.value"
    :row-data="rowData"
    :default-col-def="defaultColDef"
    row-selection="multiple"
    animate-rows="true"
    @grid-ready="onGridReady"
  />
</template>
