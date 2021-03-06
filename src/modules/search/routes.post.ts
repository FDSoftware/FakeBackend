var express = require("express");
var router = express.Router();
const { handleToken } = require("@utils/handleToken");
const { getModules } = require("@utils/getModules");
const fs = require("fs");

router.post("/search/:key", function (req: any, res: any, next: any) {
  let data = handleToken(req, res);
  const param = req.body.param;
  const search = req.body.search;
  const key = req.params.key;
  //buscamos los modulos:
  console.log(`el usuario '${data.name}' busca contenido en '${key}'`);
  /* ----------- Filtramos request para ver si coincide con los modulos-------- */
  const module_name = getModules().find((e: string) => e === `${key}.json`);
  if (!module_name) {
    res.status(404).json({ erro: "No se encuentra el endpoint json" }).end();
    return;
  }
  console.log({param,search});
  try {
    const jsonRAW = fs.readFileSync("./apis/" + module_name);
    let jsonData = JSON.parse(jsonRAW);

    let results = jsonData.filter((e: any) =>
      String(e[param]).match(new RegExp(`^(${search})`, "i"))
    );

    if (results[0]) {
      res
        .status(200) // OK
        .json({ status: "OK", data: results })
        .end();
    } else {
      res.status(404).json({ status: "sin resultados" }).end();
    }
  } catch (ex) {
    res
      .status(500)
      .json({ status: "no se puede leer el endpoint json", debug: ex.message })
      .end();
  }
});

module.exports = router;
