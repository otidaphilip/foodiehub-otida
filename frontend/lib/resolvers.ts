import db from "./db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

const resolvers = {

Query: {

products: async () => {
const [rows] = await db.query<RowDataPacket[]>(`
SELECT 
p.id,
p.name,
p.price,
p.description,
p.image_url,
r.id AS restaurant_id,
r.name AS restaurant_name,
c.id AS category_id,
c.name AS category_name
FROM products p
LEFT JOIN restaurants r ON p.restaurant_id = r.id
LEFT JOIN categories c ON p.category_id = c.id
`);

return rows.map((row:any)=>({
id:row.id,
name:row.name,
price:row.price,
description:row.description,
imageUrl:row.image_url,
restaurant:{
id:row.restaurant_id,
name:row.restaurant_name
},
category:{
id:row.category_id,
name:row.category_name
}
}));
},

/* =========================
   SEARCH PRODUCTS (FIX)
========================= */

searchProducts: async (_:any,{input}:{input:any}) => {

let query = `
SELECT 
p.id,
p.name,
p.price,
p.description,
p.image_url,
r.id AS restaurant_id,
r.name AS restaurant_name,
c.id AS category_id,
c.name AS category_name
FROM products p
LEFT JOIN restaurants r ON p.restaurant_id = r.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE 1=1
`;

const values:any[] = [];

if(input?.searchTerm){
query += ` AND p.name LIKE ?`;
values.push(`%${input.searchTerm}%`);
}

if(input?.categoryId){
query += ` AND p.category_id = ?`;
values.push(input.categoryId);
}

if(input?.restaurantId){
query += ` AND p.restaurant_id = ?`;
values.push(input.restaurantId);
}

if(input?.minPrice){
query += ` AND p.price >= ?`;
values.push(input.minPrice);
}

if(input?.maxPrice){
query += ` AND p.price <= ?`;
values.push(input.maxPrice);
}

const [rows] = await db.query<RowDataPacket[]>(query, values);

return rows.map((row:any)=>({
id:row.id,
name:row.name,
price:row.price,
description:row.description,
imageUrl:row.image_url,
restaurant:{
id:row.restaurant_id,
name:row.restaurant_name
},
category:{
id:row.category_id,
name:row.category_name
}
}));

},

restaurants: async () => {
const [rows] = await db.query<RowDataPacket[]>(
"SELECT * FROM restaurants"
);

return rows.map((row:any)=>({
id:row.id,
name:row.name,
location:row.location,
description:row.description,
imageUrl:row.image_url
}));
},

categories: async () => {
const [rows] = await db.query<RowDataPacket[]>(
"SELECT * FROM categories"
);

return rows;
},

category: async (_:any,{id}:{id:number}) => {

const [rows] = await db.query<RowDataPacket[]>(
"SELECT * FROM categories WHERE id=?",
[id]
);

return rows[0];
},

product: async (_:any,{id}:{id:number}) => {

const [rows] = await db.query<RowDataPacket[]>(`
SELECT 
p.id,
p.name,
p.price,
p.description,
p.image_url,
r.id AS restaurant_id,
r.name AS restaurant_name,
c.id AS category_id,
c.name AS category_name
FROM products p
LEFT JOIN restaurants r ON p.restaurant_id = r.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.id=?`,
[id]
);

const row=rows[0];

if(!row) return null;

return{
id:row.id,
name:row.name,
price:row.price,
description:row.description,
imageUrl:row.image_url,
restaurant:{
id:row.restaurant_id,
name:row.restaurant_name
},
category:{
id:row.category_id,
name:row.category_name
}
};

},

restaurant: async (_:any,{id}:{id:number})=>{

const [restaurantRows] = await db.query<RowDataPacket[]>(
"SELECT * FROM restaurants WHERE id=?",
[id]
);

const restaurant=restaurantRows[0];

if(!restaurant) return null;

const [productRows] = await db.query<RowDataPacket[]>(`
SELECT id,name,price,description,image_url
FROM products
WHERE restaurant_id=?`,
[id]
);

return{
id:restaurant.id,
name:restaurant.name,
location:restaurant.location,
description:restaurant.description,
imageUrl:restaurant.image_url,
products:productRows.map((row:any)=>({
id:row.id,
name:row.name,
price:row.price,
description:row.description,
imageUrl:row.image_url
}))
};

}

},

Mutation: {

addRestaurant: async (_:any,{input}:{input:any}) => {

const [result] = await db.query<ResultSetHeader>(
`INSERT INTO restaurants (name,location,description,image_url)
VALUES (?,?,?,?)`,
[
input.name,
input.location,
input.description,
input.imageUrl
]
);

return{
id:result.insertId,
...input
};

},

updateRestaurant: async (_:any,{input}:{input:any})=>{

await db.query(
`UPDATE restaurants 
SET name=?,location=?,description=?,image_url=?
WHERE id=?`,
[
input.name,
input.location,
input.description,
input.imageUrl,
input.id
]
);

const [rows] = await db.query<RowDataPacket[]>(
"SELECT * FROM restaurants WHERE id=?",
[input.id]
);

const row=rows[0];

return{
id:row.id,
name:row.name,
location:row.location,
description:row.description,
imageUrl:row.image_url
};

},

deleteRestaurant: async (_:any,{id}:{id:number})=>{
await db.query("DELETE FROM restaurants WHERE id=?", [id]);
return true;
},

addCategory: async (_:any,{input}:{input:any})=>{

const [result] = await db.query<ResultSetHeader>(
"INSERT INTO categories (name) VALUES (?)",
[input.name]
);

return{
id:result.insertId,
name:input.name
};

},

updateCategory: async (_:any,{input}:{input:any})=>{

await db.query(
"UPDATE categories SET name=? WHERE id=?",
[input.name,input.id]
);

const [rows] = await db.query<RowDataPacket[]>(
"SELECT * FROM categories WHERE id=?",
[input.id]
);

return rows[0];

},

deleteCategory: async (_:any,{id}:{id:number})=>{
await db.query("DELETE FROM categories WHERE id=?", [id]);
return true;
},

addProduct: async (_:any,{input}:{input:any})=>{

const [result] = await db.query<ResultSetHeader>(
`INSERT INTO products
(name,price,restaurant_id,category_id,description,image_url)
VALUES (?,?,?,?,?,?)`,
[
input.name,
input.price,
input.restaurantId,
input.categoryId,
input.description,
input.imageUrl
]
);

return{
id:result.insertId,
...input
};

},

deleteProduct: async (_:any,{id}:{id:number})=>{
await db.query("DELETE FROM products WHERE id=?", [id]);
return true;
}

}

};

export default resolvers;