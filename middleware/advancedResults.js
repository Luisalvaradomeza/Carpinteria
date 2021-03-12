const advancedResults = (model) => async(req, res, next)=>{
// console.log(req.query)
let query
   
// Copiar req.query
 const reqQuery = { ...req.query }

 // Campos a excluir
 const removeFields = ["select", "sort", "limit", "page"]

 // Recorrer removeFields y borrarlos del reqQuery
 removeFields.forEach((param) => {
     delete reqQuery[param]
 })

// Creacion de cadena consulta
 let queryStr = JSON.stringify(reqQuery)

 // Creacion de operadores
 queryStr = queryStr.replace(/\b(gte|gt|lt|lte|in)\b/g, (match) => `$${match}`)

 // console.log(JSON.parse(queryStr))

 // Buscar recurso
 query = model.find(JSON.parse(queryStr))
 //console.log(req.query.select)


 // Seleccionar campos
 if(req.query.select){
     const fields = req.query.select.split(",").join("")
     query = query.select(fields)
 }

 // Ordenar
 if(req.query.sort){
     const sortBy = req.query.sort.split(",").join("")
     query = query.sort(sortBy)
 } else{
     query = query.sort("-createAt")
 }

 // Paginacion
 const page = parseInt(req.query.page, 10) || 1
 const limit = parseInt(req.query.limit, 10) || 25
 const startIndex = (page - 1) * limit
 const endIndex = page * limit
 const total = await model.countDocuments()

 query = query.skip(startIndex).limit(limit)


 let results = await query

 // Resultado de paginacion
 const pagination = {}
 if(endIndex < total){
     pagination.next = {
         page: page + 1,
         limit
     }
 }

 if(startIndex > 0){
     pagination.prev = {
         page: page -1,
         limit
     }
 }

res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
}

next()
}
 module.exports = advancedResults