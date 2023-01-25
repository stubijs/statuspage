<script setup lang="ts">
import { AgGridVue } from '@ag-grid-community/vue3' // the AG Grid Vue Component
import { ModuleRegistry } from '@ag-grid-community/core'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { ref } from 'vue'
import type { PropType } from 'vue'
import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css' // Optional theme CSS
import { dataTable } from './../utils/data'

const props = defineProps({
  svgData: { type: Object as PropType<Monitor>, required: true },
})

ModuleRegistry.registerModules([ClientSideRowModelModule])

const finData = dataTable(props.svgData)

const gridApi = ref(null) // Optional - for accessing Grid's API

// Obtain API from grid's onGridReady event
const onGridReady = (params: { api: null }) => {
  gridApi.value = params.api
}

// Set rowData to Array of Objects, one Object per Row - here it is an object
const rowData = Object.values(finData)

// Each Column Definition results in one Column.
const columnDefs = [
  { field: 'city', headerName: 'City' },
  { field: 'region', headerName: 'Region' },
  { field: 'a', headerName: 'avg. TTFB', filter: 'agNumberColumnFilter', lockPosition: 'right' },
  { field: 'msMin', headerName: 'min. TTFB', filter: 'agNumberColumnFilter', lockPosition: 'right' },
  { field: 'msMax', headerName: 'max. TTFB', filter: 'agNumberColumnFilter', lockPosition: 'right' },
  { field: 'n', headerName: 'Number of Tests', filter: 'agNumberColumnFilter', lockPosition: 'right' },
]

// DefaultColDef sets props common to all Columns
const defaultColDef = {
  sortable: true,
  filter: true,
}
</script>

<template>
  <AgGridVue
    class="ag-theme-alpine mt-8"
    style="width: 100%; height: 500px;"
    :column-defs="columnDefs"
    :row-data="rowData"
    :default-col-def="defaultColDef"
    animate-rows="true"
    @grid-ready="onGridReady"
  />
</template>
