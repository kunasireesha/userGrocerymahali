import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/productservice';
import { appService } from './../../services/mahaliServices/mahali.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less']
})
export class ProductsComponent implements OnInit {
  current;
  wholeId;
  product;
  serProd = false;
  wholeProd = false;
  showSubCats = false;
  noData: boolean;
  // nodata = false;
  // noData;
  subCatData = [];
  constructor(private router: Router, public productService: ProductService, private appService: appService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params.action === "whole") {
        this.wholeId = params.wholeId;
        this.getWholeProds();
        this.wholeProd = true;
        this.serProd = false;
      } else if (params.action === "search") {
        this.product = params.product;
        this.search(this.product);
        this.wholeProd = false;
        this.serProd = true;
      } else if (params.action === "category") {
        this.catId = params.catId;
        this.getCatProducts('');
        this.wholeProd = false;
        this.serProd = true;
      } else if (params.action === 'subCategory') {
        this.getSubProducts('');
        this.wholeProd = false;
        this.serProd = true;
        this.subId = params.subId;
      }


    });
  }

  ngOnInit() {
    this.getCategories();
  }
  showCategories = false;
  skuData = [];

  collapse(catId) {
    this.showCategories = !this.showCategories;
    //     this.subCatData = [];
    //     for(var i=0;i<this.category.length;i++){
    // for(var j=0;j<this.category[i].subcategory.length;j++){
    //   if(catId ===this.category[i].subcategory[j].category_id ){
    //     this.subCatData.push(this.category[i].subcategory[j]);
    //           console.log(this.subCatData);
    //     this.showCategories = !this.showCategories;
    //     this.showSubCat(this.subId);
    //   }
    // }
    //     }



  }
  showProduxtDetails(prodId) {
    this.router.navigate(['/productdetails'], { queryParams: { prodId: prodId } });
  }
  products = [];
  skuid;
  getWholeProds() {
    this.skuData = [];
    this.appService.wholeProducts(this.wholeId).subscribe(res => {
      this.products = res.json().products;
      for (var i = 0; i < this.products.length; i++) {
        for (var j = 0; j < this.products[i].sku_details.length; j++) {
          this.products[i].sku_details[j].product_name = this.products[i].product_name;
          this.skuData.push(this.products[i].sku_details[j]);
        }
      }
      // for (var i = 0; i < this.products.length; i++) {
      //   for (var k = 0; k < this.products[i].sku_details.length; k++) {
      //     // if(parseInt(skId) ===this.products[i].sku_details[k].skid){
      //     this.products[i].actual_price = this.products[i].sku_details[0].actual_price;
      //     this.products[i].selling_price = this.products[i].sku_details[0].selling_price;
      //     this.products[i].product_image = this.products[i].sku_details[0].product_image;
      //     this.skuid = this.products[i].sku_details[0].skid;



      //     // this.skuArr.push(this.skuData);

      //     // }
      //   }
      // }


      // for (var i = 0; i < this.products.length; i++) {
      //   for (var j = 0; j < this.skusData.length; j++) {
      //     this.skusData[j].actual_price = this.products[i].actual_price;
      //     this.skusData[j].selling_price = this.products[i].selling_price;
      //   }
      // }

    }, err => {

    })
  }
  changeSize(skId) {
    for (var i = 0; i < this.products.length; i++) {
      // for(var j = 0;j<this.cartData[i].products;j++){
      for (var k = 0; k < this.products[i].sku_details.length; k++) {
        if (parseInt(skId) == this.products[i].sku_details[k].skid) {
          this.products[i].actual_price = this.products[i].sku_details[k].actual_price;
          this.products[i].selling_price = this.products[i].sku_details[k].selling_price;
          this.products[i].product_image = this.products[i].sku_details[k].product_image;
          this.skuid = this.products[i].sku_details[k].skid;
          // this.skuArr.push(this.skuData);
        }
      }
    }
  }
  cartDetails = [];
  cartCount = [];
  addtoCart(Id, skId) {
    var inData = {
      "products": [{
        product_id: Id,
        sku_id: skId
      }],
      "user_id": JSON.parse(localStorage.getItem('userId')),
      "item_type": "grocery"
    }
    this.appService.addtoCart(inData).subscribe(res => {
      this.cartDetails = res.json().selling_price_total;
      this.cartCount = res.json().count;
      this.getCart();
      swal(res.json().message, "", "success");
    }, err => {

    })
  }
  addtoWish(Id, skId) {
    var inData = {
      "user_id": JSON.parse(localStorage.userId),
      "product_id": Id,
      "sku_id": skId,
      "item_type": "grocery"
    }
    this.appService.addToWish(inData).subscribe(res => {
      console.log(res.json());
      swal(res.json().message, "", "success");
      this.getWish();
    }, err => {

    })
  }
  getWish() {
    this.appService.getWish().subscribe(res => {
      console.log(res.json());
    }, err => {

    })
  }
  billing;
  getCart() {
    var inData = localStorage.getItem('userId');
    this.appService.getCart(inData).subscribe(res => {
      this.cartDetails = res.json().cart_details;
      this.cartCount = res.json().count;
      this.billing = res.json().selling_Price_bill;
    }, err => {

    })
  }
  serProducts: any;
  search(product) {
    this.skuData = [];
    this.appService.searchProducts(product).subscribe(res => {
      this.serProducts = res.json().data;
      if (this.serProducts == "No products found with your search") {
        this.noData = true;
      } else {
        for (var i = 0; i < this.serProducts.length; i++) {
          for (var j = 0; j < this.serProducts[i].sku_details.length; j++) {
            this.serProducts[i].sku_details[j].product_name = this.serProducts[i].product_name;
            this.skuData.push(this.serProducts[i].sku_details[j]);
            this.noData = false;
          }
        }
      }

    }, err => {

    })
  }
  category = [];
  getCategories() {
    this.subCatData = [];
    this.appService.getCategories().subscribe(resp => {
      this.category = resp.json().categories;
      // this.showSubCat(this.subId);
      for (var i = 0; i < this.category.length; i++) {
        for (var j = 0; j < this.category[i].subcategory.length; j++) {
          this.subCatData.push(this.category[i].subcategory[j]);
          console.log(this.subCatData);
        }
      }
    })
  }
  subCategory = [];
  showsubCat(index, id) {
    this.subCategory = [];
    this.selectedCat = index;
    this.showCategories = true;

    for (var i = 0; i < this.subCatData.length; i++) {
      if (id === this.subCatData[i].category_id) {
        this.subCategory.push(this.subCatData[i]);
      }
    }
  }
  closesubSubCat() {
    this.showCategories = false;
    // this.showSubCategories = false;
  }
  selectedCat = false;
  openSub(index) {
    this.selectedCat !== this.selectedCat;
    this.current = index;
  }

  skuArr = [];
  prodData = [];
  subId;
  getSubProducts(subid) {
    this.skuData = [];
    this.subId = (subid === '') ? this.subId : subid;
    this.appService.productBySubCatId(this.subId).subscribe(res => {
      this.prodData = res.json().products;
      for (var i = 0; i < this.prodData.length; i++) {
        for (var j = 0; j < this.prodData[i].sku_details.length; j++) {
          this.prodData[i].sku_details[j].product_name = this.prodData[i].product_name;
          this.skuData.push(this.prodData[i].sku_details[j]);
        }
      }
      if (res.json().message === "No records Found") {
        this.noData = true;
      }
    }, err => {

    })
  }
  catId;
  getCatProducts(id) {
    this.skuData = [];
    this.catId = (id === '') ? this.catId : id;
    this.appService.productByCatId(this.catId).subscribe(res => {
      this.prodData = res.json().products;
      for (var i = 0; i < this.prodData.length; i++) {
        for (var j = 0; j < this.prodData[i].sku_details.length; j++) {
          this.prodData[i].sku_details[j].product_name = this.prodData[i].product_name;
          this.skuData.push(this.prodData[i].sku_details[j]);
        }
      }
      if (res.json().message === "No records Found") {
        this.noData = true;
      }


    }, err => {

    })
  }
  //   toggle(current){
  //     this.current = current;
  //     alert(this.current);
  // this.current!== this.current;
  //   }
}
