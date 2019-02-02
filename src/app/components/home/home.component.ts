import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsData } from '../../services/productsdata';
import { ProductService } from '../../services/productservice';
import { appService } from './../../services/mahaliServices/mahali.service';
import { ActivatedRoute } from '@angular/router';
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  bannerData = [];
  offerBan = [];
  dummyBan = [];
  cartCount;
  product: ProductsData = {
    name: "Utpal Kumar Das"
  };
  constructor(private router: Router, public productService: ProductService, private appService: appService, private route: ActivatedRoute) { }
  showAllProductsScreen = true;
  showVegetablesScreen = true;
  showFruitScreen = false;
  showTeaScreen = false;
  showBreadScreen = false;
  showJuiceScreen = false;
  showAllProducts() {
    this.showAllProductsScreen = false;
    this.showVegetablesScreen = true;
    this.showFruitScreen = false;
    this.showTeaScreen = false;
    this.showBreadScreen = false;
    this.showJuiceScreen = false;
    this.VegetablesData();
  }
  showVegetables() {
    this.showVegetablesScreen = true;
    this.showAllProductsScreen = false;
    this.showFruitScreen = false;
    this.showTeaScreen = false;
    this.showBreadScreen = false;
    this.showJuiceScreen = false;
    this.VegetablesData();
  }
  showFruits() {
    this.showVegetablesScreen = false;
    this.showAllProductsScreen = false;
    this.showFruitScreen = true;
    this.showTeaScreen = false;
    this.showBreadScreen = false;
    this.showJuiceScreen = false;
    this.fruitsData();
  }
  showTea() {
    this.showVegetablesScreen = false;
    this.showAllProductsScreen = false;
    this.showFruitScreen = false;
    this.showTeaScreen = true;
    this.showBreadScreen = false;
    this.showJuiceScreen = false;
    this.teaData();
  }
  showBread() {
    this.showVegetablesScreen = false;
    this.showAllProductsScreen = false;
    this.showFruitScreen = false;
    this.showTeaScreen = false;
    this.showBreadScreen = true;
    this.showJuiceScreen = false;
    this.breadData();
  }
  showJuices() {
    this.showVegetablesScreen = false;
    this.showAllProductsScreen = false;
    this.showFruitScreen = false;
    this.showTeaScreen = false;
    this.showBreadScreen = false;
    this.showJuiceScreen = true;
    this.juiceData();
  }
  ngOnInit() {
    this.VegetablesData();
    this.productService.product = this.product;
    this.getBanners();
    this.getBrands();
    // this.allProductsData();
  }
  starList: boolean[] = [true, true, true, true, true];       // create a list which contains status of 5 stars
  rating: number;
  //Create a function which receives the value counting of stars click, 
  //and according to that value we do change the value of that star in list.
  setStar(data: any) {
    this.rating = data + 1;
    for (var i = 0; i <= 4; i++) {
      if (i <= data) {
        this.starList[i] = false;
      }
      else {
        this.starList[i] = true;
      }
    }
  }
  showProduxtDetails(prodId) {
    this.router.navigate(['/productdetails'], { queryParams: { prodId: prodId } });
  }
  skuId;
  getProduct() {
    this.appService.getProduct().subscribe(resp => {
      this.product = resp.json().products;
      console.log(this.product);
    });
  }
  cartDetails = [];
  cartValue;
  billing;
  getCart() {
    var inData = localStorage.getItem('userId');
    this.appService.getCart(inData).subscribe(res => {
      this.cartDetails = res.json().cart_details;
      this.cartValue = res.json().count;
      this.billing = res.json().selling_Price_bill;
    }, err => {

    })
  }
  addtoCart(Id, skId) {
    if (localStorage.userId === undefined) {
      swal('Please Login', '', 'warning');
      return;
    }
    var inData = {
      "products": [{
        product_id: Id,
        sku_id: skId
      }],
      "user_id": JSON.parse(localStorage.getItem('userId')),
      "item_type": "grocery"
    }
    this.appService.addtoCart(inData).subscribe(res => {
      if (res.json().status === 400) {
        swal(res.json().message, "", "error");
      } else {
        this.cartDetails = res.json().selling_price_total;
        this.cartCount = res.json().count;
        this.getCart();
        swal(res.json().message, "", "success");
      }

    }, err => {

    })
  }
  mainData = [];
  bannerArr = [];
  getBanners() {
    this.appService.getBanners().subscribe(res => {
      this.mainData = res.json().result;
      for (var i = 0; i < this.mainData.length; i++) {
        for (var j = 0; j < this.mainData[i].sku_details.length; j++) {
          this.bannerArr.push(this.mainData[i].sku_details[j]);
        }
      }
    }, err => {

    })
  }
  brandsData = [];
  getBrands() {
    this.appService.getBrands().subscribe(res => {
      this.brandsData = res.json().data;
      // for (var i = 0; i < this.mainData.length; i++) {
      //   for (var j = 0; j < this.mainData[i].sku_details.length; j++) {
      //     this.bannerArr.push(this.mainData[i].sku_details[j]);
      //   }
      // }
    }, err => {

    })
  }
  // banners
  // get all products
  allproductsData = [];
  allArr = [];
  // allProductsData() {
  //   this.vegArr = [];
  //   this.fruitArr = [];
  //   this.teaArr = [];
  //   this.breadArr = [];
  //   this.juiceArr = [];
  //   this.allArr = [];
  //   this.appService.getAllProducts().subscribe(res => {
  //     this.allproductsData = res.json().data;
  //     for (var i = 0; i < this.vegetablesData.length; i++) {
  //       this.allproductsData[i].sku_details.product_name = this.allproductsData[i].product_name;
  //       this.allArr.push(this.allproductsData[i].sku_details)
  //     }
  //   }, err => {
  //   })
  // }
  vegdata = [];
  // vegetables
  vegArr = [];
  vegetablesData = [];
  VegetablesData() {
    this.vegArr = [];
    this.fruitArr = [];
    this.teaArr = [];
    this.breadArr = [];
    this.juiceArr = [];
    this.allArr = [];
    this.appService.getVegetables().subscribe(res => {
      this.vegArr = [];
      this.vegetablesData = res.json().data;
      for (var i = 0; i < this.vegetablesData.length; i++) {
        this.vegetablesData[i].sku_details.product_name = this.vegetablesData[i].product_name;
        this.vegArr.push(this.vegetablesData[i].sku_details)
      }
    }, err => {
    })
  }
  // fruits
  fruitsData1 = [];
  fruitArr = [];
  fruitsData() {
    this.vegArr = [];
    this.fruitArr = [];
    this.teaArr = [];
    this.breadArr = [];
    this.juiceArr = [];
    this.allArr = [];
    this.appService.getFruits().subscribe(res => {
      this.fruitsData1 = res.json().data;
      for (var i = 0; i < this.fruitsData1.length; i++) {
        this.fruitsData1[i].sku_details.product_name = this.fruitsData1[i].product_name;
        this.fruitArr.push(this.fruitsData1[i].sku_details);
      }
    }, err => {
    })
  }
  // tea
  teaData1 = [];
  teaArr = [];
  teaData() {
    this.vegArr = [];
    this.fruitArr = [];
    this.teaArr = [];
    this.breadArr = [];
    this.juiceArr = [];
    this.allArr = [];
    this.appService.getTea().subscribe(res => {
      this.teaData1 = res.json().data;
      for (var i = 0; i < this.teaData1.length; i++) {
        this.teaData1[i].sku_details.product_name = this.teaData1[i].product_name;
        this.teaArr.push(this.teaData1[i].sku_details)
      }
    }, err => {
    })
  }
  // bread
  breadData1 = [];
  breadArr = [];
  breadData() {
    this.vegArr = [];
    this.fruitArr = [];
    this.teaArr = [];
    this.breadArr = [];
    this.juiceArr = [];
    this.allArr = [];
    this.appService.getBread().subscribe(res => {
      this.breadData1 = res.json().data;
      for (var i = 0; i < this.breadData1.length; i++) {
        this.breadData1[i].sku_details.product_name = this.breadData1[i].product_name;
        this.breadArr.push(this.breadData1[i].sku_details)
      }
    }, err => {
    })
  }

  // juice
  juiceData1 = [];
  juiceArr = [];
  juiceData() {
    this.vegArr = [];
    this.fruitArr = [];
    this.teaArr = [];
    this.breadArr = [];
    this.juiceArr = [];
    this.allArr = [];
    this.appService.getJuice().subscribe(res => {
      this.juiceData1 = res.json().data;
      for (var i = 0; i < this.juiceData1.length; i++) {
        this.juiceData1[i].sku_details.product_name = this.juiceData1[i].product_name;
        this.juiceArr.push(this.juiceData1[i].sku_details)
      }
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
  enlargeImg;
  open(skid): void {
    for (var i = 0; i < this.vegetablesData.length; i++) {
      for (var j = 0; j < this.vegetablesData[i].sku_details.length; j++) {
        if (skid === this.vegetablesData[i].sku_details[j].skid) {
          this.enlargeImg = this.vegetablesData[i].sku_details[j].image;
          jQuery("#enlargeImg").modal("show");
        }
      }

    }
    for (var i = 0; i < this.fruitsData1.length; i++) {
      for (var j = 0; j < this.fruitsData1[i].sku_details.length; j++) {
        if (skid === this.fruitsData1[i].sku_details[j].skid) {
          this.enlargeImg = this.fruitsData1[i].sku_details[j].image;
          jQuery("#enlargeImg").modal("show");
        }
      }

    }
    for (var i = 0; i < this.teaData1.length; i++) {
      for (var j = 0; j < this.teaData1[i].sku_details.length; j++) {
        if (skid === this.teaData1[i].sku_details[j].skid) {
          this.enlargeImg = this.teaData1[i].sku_details[j].image;
          jQuery("#enlargeImg").modal("show");
        }
      }


    }
    for (var i = 0; i < this.breadData1.length; i++) {
      for (var j = 0; j < this.breadData1[i].sku_details.length; j++) {
        if (skid === this.breadData1[i].sku_details[j].skid) {
          this.enlargeImg = this.breadData1[i].sku_details[j].image;
          jQuery("#enlargeImg").modal("show");
        }
      }


    }
    for (var i = 0; i < this.juiceData1.length; i++) {
      for (var j = 0; j < this.juiceData1[i].sku_details.length; j++) {
        if (skid === this.juiceData1[i].sku_details[j].skid) {
          this.enlargeImg = this.juiceData1[i].sku_details[j].image;
          jQuery("#enlargeImg").modal("show");
        }
      }


    }

  }
}






