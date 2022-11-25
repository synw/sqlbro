<template>
  <div>
    <h1>Sqlbro example: filter products</h1>
    <p>{{ data.products.length }} results</p>
    <div>
      <button @click="filter('alcool', '<=5')">Low alcohol</button>
      <button @click="filter('alcool', '>5')">High alcohol</button>
      <ul>
        <li v-for="product in data.products" :key="product.id" :name="product.name">
          <div class="mt-5">{{ product.name }}</div>
          <div class="mt-5">
            <div class="mt-2">Alcohol: {{ product.props.alcool }}%</div>
            <div class="mt-2 ">
              <div class="mr-3" v-if="product.props.price25">25cl: {{ product.props.price25 }}&euro;</div>
              <div>50cl: {{ product.props.price50 }}&euro;</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount } from "vue";
import { initDb } from "@sqlbro/client"
import { Product } from "./interfaces";
import { loadProductsFromCategoryId, filterProps } from "./api";

const data = reactive({
  products: new Array<Product>()
});

async function filter(prop: string, condition: string) {
  data.products = await filterProps(4, prop, condition)
}

async function init() {
  initDb();
  data.products = await loadProductsFromCategoryId(4)
}

onBeforeMount(() => init())
</script>

