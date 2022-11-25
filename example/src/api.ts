import { query } from "@sqlbro/client"
import { Product } from "./interfaces";

function _parseProducts(data: Array<Record<string, any>>): Array<Product> {
  const products = new Array<Product>();
  data.forEach((row) => {
    row.props = JSON.parse(row.props);
    products.push(row as Product)
  });
  return products
}

async function loadProductsFromCategoryId(categoryId: number): Promise<Array<Product>> {
  const q = `SELECT * FROM product WHERE category_id=${categoryId}`;
  console.log(q);
  const res = await query<Array<Record<string, any>>>(q);
  const products = _parseProducts(res);
  console.log(JSON.stringify(products, null, "  "));
  return products
}

async function filterProps(categoryId: number, prop: string, condition: string): Promise<Array<Product>> {
  const q = `SELECT * FROM product 
    WHERE json_extract(product.props,'$.${prop}')${condition} AND category_id=${categoryId}`
  console.log(q);
  const res = await query<Array<Record<string, any>>>(q);
  const products = _parseProducts(res);
  console.log(JSON.stringify(products, null, "  "));
  return products
}

export { loadProductsFromCategoryId, filterProps }