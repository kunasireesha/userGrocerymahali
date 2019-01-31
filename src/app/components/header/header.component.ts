
import { UseraccountComponent } from './../useraccount/useraccount.component';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { LoginComponent } from '../../components/login/login.component';
import { Router } from '@angular/router';
import { RegistrationComponent } from '../../components/registration/registration.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appService } from './../../services/mahaliServices/mahali.service';
declare var jQuery: any;
declare var $: any;
import swal from 'sweetalert'
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
    @Input() cartCount: number;
    @Input() billing: number;
    registerForm: FormGroup;
    loginForm: FormGroup;
    forgotForm: FormGroup;
    submitted = false;
    loginSubmitted = false;
    forgotSubmitted = false;
    category: any;
    product: any;
    loginDetails: any;
    myAccount: boolean = false;
    phone: boolean = false;
    showdetails = false;
    showSubCats = false;
    showCartDetail = false;
    showLoginScreen = true;
    showRegistration = true;
    showOpacity = false;
    showLogin = false;
    IsmodelShow = false;
    showCategories = false;
    subcat = [];

    constructor(public dialog: MatDialog, private router: Router, private formBuilder: FormBuilder, public appService: appService) {
        if (localStorage.token === undefined) {
            this.showRegistration = true;
            this.showLoginScreen = true;
            this.myAccount = false;
        } else {
            this.showRegistration = false;
            this.showLoginScreen = false;
            this.myAccount = true;
            this.phone = true;
            this.userMobile = JSON.parse(localStorage.getItem('phone'));
            this.userName = (localStorage.getItem('userName'));
        }
        this.getCart();
    }
    // item = {
    //     quantity: 1
    // }
    userMobile;
    userName;
    location;
    ngOnInit() {
        if (localStorage.token === undefined) {
            this.showRegistration = true;
            this.showLoginScreen = true;
            this.myAccount = false;
        } else {
            this.showRegistration = false;
            this.showLoginScreen = false;
            this.myAccount = true;
            this.phone = true;
            this.userMobile = JSON.parse(localStorage.getItem('phone'));
            this.userName = (localStorage.getItem('userName'));
        }
        // if ((localStorage.token)! === undefined) {
        //     this.showRegistration = false;
        //     this.showLoginScreen = false;
        //     this.myAccount = true;
        // }
        // if(navigator.geolocation){
        //     navigator.geolocation.getCurrentPosition(position => {
        //         this.lat=position.coords.latitude;
        //         this.long=position.coords.longitude;

        //         var latlng = { lat: this.lat, lng:this.long };

        //        let geocoder = new google.maps.Geocoder();
        //      geocoder.geocode(  {'location':latlng}, (results, status) => {
        //      if (status == google.maps.GeocoderStatus.OK) {
        //      let result = results[0];
        //      let rsltAdrComponent = result.address_components;
        //      let resultLength = rsltAdrComponent.length;
        //      if (result != null) {
        //      } else {
        //      window.alert('Geocoder failed due to: ' + status);
        //      }
        //      }
        //      });
        //      });     
        //    };


        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.location = position.coords;
            });
        }
        this.registerForm = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', Validators.required],
            mobile_number: ['', [Validators.required, Validators.minLength(10)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            retype_password: ['', [Validators.required, Validators.minLength(6)]],
            latitude: 16.398956,
            longitude: 78.637009
        });
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
        this.forgotForm = this.formBuilder.group({
            mob_number: ['', [Validators.required]],
        });
        this.getCategories();
        this.getProduct();
        // this.login();
        // this.getLocation();
        // this.getCart();
    }

    // showLogin() {
    //     const dialogConfig = new MatDialogConfig();
    //     dialogConfig.disableClose = true;
    //     dialogConfig.autoFocus = true;
    //     this.dialog.open(LoginComponent, dialogConfig);
    // }


    // showRegistration() {
    //     const dialogConfig = new MatDialogConfig();
    //     dialogConfig.disableClose = true;
    //     dialogConfig.autoFocus = true;
    //     this.dialog.open(RegistrationComponent, dialogConfig);

    // }
    showLoginPop() {
        this.showLogin = true;
    }
    showCartItems() {
        this.showCartDetail = !this.showCartDetail;
    }
    itemIncrease(cartId) {
        for (var i = 0; i < this.cartData.length; i++) {
            if (this.cartData[i].cart_id === cartId) {
                this.cartData[i].quantity = this.cartData[i].quantity + 1;
                this.modifyCart(this.cartData[i].quantity, cartId);
                // this.getCart();
                return;
            }
        }
    }

    itemDecrease(cartId) {
        for (var i = 0; i < this.cartData.length; i++) {
            if (this.cartData[i].cart_id === cartId) {
                if (this.cartData[i].quantity === 1) {
                    this.delCart(cartId);
                    return;
                } else {
                    this.cartData[i].quantity = this.cartData[i].quantity - 1;
                    this.modifyCart(this.cartData[i].quantity, cartId);
                }
                // this.getCart();
                return;
            }
        }

    }

    //modify cart

    modifyCart(quantity, cartId) {
        var params = {
            "quantity": quantity
        }

        this.appService.modifyCart(params, cartId).subscribe(resp => {
            if (resp.json().status === 200) {
                // swal(resp.json().message, "", "success");
                jQuery("#signupmodal").modal("hide");
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                this.getCart();
                // this.showRegistration = false;
                // localStorage.setItem('userId', (resp.json().reg_id));
                // this.myAccount = true
                // this.showOpacity = false;
                // this.onCloseCancel();
                // this.router.navigate(['/address']);
            }
        }, err => {

        })
    }



    showProduxtDetails() {
        this.router.navigate(['/productdetails'], { queryParams: { order: 'popular' } });
    }
    showAddress() {
        this.router.navigate(['/address'], { queryParams: { order: 'popular' } });
    }
    subCatData = [];
    subId;
    showSubCat(Id) {
        this.subId = Id;
        this.subCatData = [];
        this.showSubCats = true;
        for (var i = 0; i < this.category.length; i++) {
            for (var j = 0; j < this.category[i].subcategory.length; j++) {
                if (Id === this.category[i].subcategory[j].category_id) {
                    this.category[i].subcategory[j].cat_name = this.category[i].category_name;
                    this.subCatData.push(this.category[i].subcategory[j]);
                }
            }
        }
    }
    showProbyCat(catId, action, catName) {
        this.showSubCats = false;
        jQuery("#itemdesc").modal("hide");
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        this.router.navigate(['/products'], { queryParams: { catId: catId, action: action, catName: catName } });
    }
    showProbySubCat(SubCatId, action, catName, subCat) {
        this.showSubCats = false;
        jQuery("#itemdesc").modal("hide");
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        this.router.navigate(['/products'], { queryParams: { subId: SubCatId, action: action, catName: catName, subCat: subCat } });
    }
    signOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        this.showRegistration = true;
        this.showLoginScreen = true;
        this.myAccount = false;
        this.phone = false;
        this.router.navigate(["/"]);
    }
    get f() { return this.registerForm.controls; }
    registration(form: FormGroup) {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        if (this.registerForm.value.password != this.registerForm.value.retype_password) {
            swal("Password doesn't matched", "", "warning");
            return;
        } else {
            this.appService.registration(this.registerForm.value).subscribe(resp => {
                if (resp.json().status === 200) {
                    swal(resp.json().message, "", "success");
                    jQuery("#signupmodal").modal("hide");
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    // this.showRegistration = false;
                    localStorage.setItem('userId', (resp.json().reg_id));
                    // this.myAccount = true
                    // this.showOpacity = false;
                    // this.onCloseCancel();
                    // this.router.navigate(['/address']);
                } else if (resp.json().status === 400) {
                    swal(resp.json().message, "", "error");
                    // jQuery("#signupmodal").modal("hide");
                }
            }, err => {

            })
        }



    }
    get f1() { return this.loginForm.controls; }
    login() {
        this.loginSubmitted = true;

        if (this.loginForm.invalid) {
            return;
        }
        this.appService.login(this.loginForm.value).subscribe(resp => {
            if (resp.json().status === 200) {
                swal(resp.json().message, "", "success");
                localStorage.setItem('token', JSON.stringify(resp.json().token));
                jQuery("#loginmodal").modal("hide");
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                this.showRegistration = false;
                this.showLoginScreen = false;
                this.myAccount = true;
                this.appService.loginDetailsbyEmail(this.loginForm.value.email).subscribe(response => {
                    console.log(response.json());
                    localStorage.setItem('phone', (response.json().data[0].mobile_number));
                    localStorage.setItem('email', (response.json().data[0].email));
                    localStorage.setItem('userId', (response.json().data[0].reg_id));
                    localStorage.setItem('userName', (response.json().data[0].first_name) + " " + (response.json().data[0].last_name));
                    this.loginDetails = response.json().data[0];
                    this.phone = true;

                })
            }
            else if (resp.json().status === 404 || resp.json().status === 400) {
                swal(resp.json().message, "", "error");
            }
        }, err => {

        })

    }
    getCategories() {
        this.appService.getCategories().subscribe(resp => {
            this.category = resp.json().categories;
            // this.showSubCat(this.subId);
        })
    }

    getProduct() {

    }

    get f2() { return this.forgotForm.controls; }
    forgot() {
        this.forgotSubmitted = true;
        if (this.forgotForm.invalid) {
            return;
        }
        var inData = {
            mobile_number: this.forgotForm.value.mob_number
        }
        this.appService.forgotPassword(inData).subscribe(resp => {
            if (resp.json().status === 200) {
                jQuery("#forgotpass").modal("hide");
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                swal(resp.json().message, "", "success");
            } else {
                swal(resp.json().message, "", "error");
            }


        }, err => {
            swal(err.json().message, "", "error");
        })
    }
    lat;
    long;
    // getLocation(){
    //     if(navigator.geolocation){
    //         navigator.geolocation.getCurrentPosition(position => {
    //             this.lat=position.coords.latitude;
    //             this.long=position.coords.longitude;
    //             var latlng = { lat: this.lat, lng:this.long };

    //            let geocoder = new google.maps.Geocoder();
    //          geocoder.geocode(  {'location':latlng}, (results, status) => {
    //          if (status == google.maps.GeocoderStatus.OK) {
    //          let result = results[0];
    //          let rsltAdrComponent = result.address_components;
    //          let resultLength = rsltAdrComponent.length;
    //          if (result != null) {
    //          } else {
    //          window.alert('Geocoder failed due to: ' + status);
    //          }
    //          }
    //          });
    //          });     
    //        };
    // }

    cartDetails = [];
    cartData = [];

    getCart() {
        var inData = localStorage.getItem('userId');
        this.appService.getCart(inData).subscribe(res => {
            this.cartData = res.json().cart_details;
            for (var i = 0; i < this.cartData.length; i++) {
                this.cartData[i].prodName = this.cartData[i].products.product_name;
                for (var j = 0; j < this.cartData[i].products.sku_details.length; j++) {
                    this.cartData[i].products.skuValue = this.cartData[i].products.sku_details[0].size;
                    this.cartData[i].products.skuValue = this.cartData[i].products.sku_details[0].size;
                    this.cartData[i].products.skid = this.cartData[i].products.sku_details[0].skid;
                    this.cartData[i].products.selling_price = this.cartData[i].products.sku_details[0].selling_price;
                    this.cartData[i].products.img = this.cartData[i].products.sku_details[0].image;
                }
            }
            this.cartCount = res.json().count;
            this.billing = res.json().selling_Price_bill;
        }, err => {

        })
    }
    delCart(cartId) {
        var inData = cartId;
        this.appService.delCart(inData).subscribe(res => {
            swal(res.json().message, "", "success");
            this.getCart();
        }, err => {

        })
    }
    search(product, action) {
        // this.appService.searchProducts(product).subscribe(res=> {
        this.router.navigate(['/products'], { queryParams: { product: product, action: action } });
        // },err=> {

        // })    
    }
    // updateCart() {
    //     var inData =
    //         this.appService.updateCart().subscribe(res => {

    //         }, err => {

    //         })
    // }

    hidesub() {
        this.showCategories = !this.showCategories;
        this.showOpacity = true;
        this.showSubCats = false;
    }

}
