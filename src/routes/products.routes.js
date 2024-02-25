import ProductManager from "../dao/filesystem/productManager.js";
import { MongoProductManager } from "../dao/db/productManager.js";
import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";

const prodRoute = Router();


//pedido de productos por ID
prodRoute.get("/:pid", async (req, res) => {
  const pid = req.params.pid;
  res.send(await MongoProductManager.getProductById(pid))
});

// Busqueda de Products con paginate y filtro
prodRoute.get("/", async (req,res)=>{
  const { limit = 7, page = 1, category = true, sort = 1 } = req.query;
  //return res.send(await MongoProductManager.getProducts(limit,page,category,sort))

const options = {
  limit: limit,
  page: page,
  category: category,
  sort: {
    price: sort,
  }
}

  try {
    const {
      docs,
      totalDocs,
      limit: limitPag,
      totalPages,
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage,
    } = await productModel.paginate({status: category}, {options})

    

    return res.json({
      Status: 'success',
      mensaje: 'Busqueda exitosa',
      Payload: docs,
      totalPages: totalDocs,
      nextPage: nextPage,
      prevPage: prevPage,
      page: page,
      totalPages: totalPages,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
     
    })

  }  catch (error) {
    return res.json({message: "failed", message:error.message})
  }
})


//Subida de productos
prodRoute.post("/", async (req, res) => {
  res.send(await MongoProductManager.addProduct(req.body))   
});

prodRoute.post("/many", async (req, res) => {
  res.send(await MongoProductManager.addMany(req.body))   
});

//editado de producto
prodRoute.put("/:id", async (req, res) => {
  const { id } = req.params;
  res.send(await MongoProductManager.updateProduct(id, req.body))
});

//borrado de producto
prodRoute.delete("/:id", async (req, res) => {
  const { id } = req.params;
  res.send(await MongoProductManager.deleteProduct(id))
});

export default prodRoute;
