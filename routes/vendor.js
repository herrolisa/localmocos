module.exports = function(express, app, path, bodyParser, querystring, db) {
    var router = express.Router();

    var testJson = {
        "name": "Product",
        "response": "Ok"
    };
    var businessType;
    var services;
    var markets;
    var certs;

    db.Type.findAll({
    })
    .then((data) => {
      businessType = JSON.parse(JSON.stringify(data));
    });

    db.Service.findAll({
    })
    .then((data) => {
      services = JSON.parse(JSON.stringify(data));
    })

    db.Market.findAll({
    })
    .then((data) => {
      markets = JSON.parse(JSON.stringify(data));
    })

    db.Certification.findAll({
    })
    .then((data) => {
      certs = JSON.parse(JSON.stringify(data));
    })

    /*************
  1. Create new Vendor
  2. Edit Vendor info
  3. Delete Vendor(Inactive)

  4. Add Product
  5. Delete Product(Inactive)
  6. Edit Product
  7. View Products

  **************/


    /**** New Vendor Form *****/

    app.get('/vendor/new', function(req, res) {
      res.render('vendorForm',{
          subtitle: "Vendor Registration",
          formTitle: "Vendor Registration",
          vendor: {},
          businessType: businessType,
          services: services,
          markets: markets,
          certs: certs,
          // zipcode: zipcode
          //// currently undefined ////
      });
    });

    app.post('/vendor', function(req, res, next) {
      db.Zipcode.findOne({
        where: {
          city: req.body.city[0].toUpperCase() + req.body.city.slice(1),
          island: req.body.island[0].toUpperCase() + req.body.island.slice(1),
          zip: req.body.zipcode
        }
      })
      .then((data) => {
        if(data) {
          var zipId = data.dataValues.id; // zip_id
          db.VendorInfo.create({
            user_id: 1,
            image: req.body.image,
            company_name: req.body.company_name,
            business_reg_num: req.body.business_reg_num,
            business_description: req.body.description,
            dba: req.body.dba,
            address1: req.body.address1,
            address2: req.body.address2,
            business_ph: req.body.business_ph,
            business_ph2: req.body.phoneTwo,
            sales_ph: req.body.sales_ph,
            website: req.body.website,
            email: req.body.email,
            zip_id: zipId,
            isActive: true,
          })
          .then((vendor) => {
            console.log(vendor);
            console.log(vendor.id);
          });
        } else {
          res.send('City, Island, and Zipcode do not match.');
        }
      });
    });

    app.get(/vendor\/\d+\/edit$/, function(req, res) {
      var vendorId = cleanParamMiddle(req.url, 2);
      db.VendorInfo.findById(vendorId)
      .then((data) => {
        var vendor = JSON.parse(JSON.stringify(data));
        console.log(vendor);
        res.render('vendorForm',{
          vendor: vendor,
          businessType: businessType,
          services: services,
          markets: markets,
          certs: certs,
          zipcode: zipcode
        });
      })

           /* } */
        // testJson.name = "Edit Vendor id=" + cleanParamMiddle(req.url, 2);
        // res.json(testJson);
    });



    app.get(/vendor\/\d+$/, function(req, res) {
        // /* */
        //         res.render('vendorEditForm', {
        //             methodType: 'GET',
        //             actionType: '/vendor/{id}',
        //             formTitle: 'Edit Vendor'
        //         });
        //    /* } */
        // testJson.name = "View Vendor id=" + cleanParamMiddle(req.url, 2);
        // res.json(testJson);
      db.VendorInfo.findOne({
        where: {id: cleanParamMiddle(req.url, 2)}
      })
      .then(function (vendorObject) {
        var vendor = vendorObject;
        db.Product.findAll({
          where: {vendor_info_id: cleanParamMiddle(req.url, 2)}
        })
        .then(function(productArray){
        res.render('vendor', {subtitle: vendor.dba, image: vendor.image, vendor: vendor.dba, address: vendor.address1, phone: vendor.business_ph, email: vendor.email, website: vendor.website, description: vendor.business_description, products: productArray})
        });
      });
    });

    return router;
}


function cleanParamMiddle(thisParam, index) {
    var paramArray = thisParam.split('/');
    return paramArray[index];
}