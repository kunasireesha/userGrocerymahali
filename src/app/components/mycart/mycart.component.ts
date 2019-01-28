import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ItemsComponent } from '../../components/items/items.component';
import { PromocodesComponent } from '../../components/promocodes/promocodes.component';
import { appService } from './../../services/mahaliServices/mahali.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-mycart',
    templateUrl: './mycart.component.html',
    styleUrls: ['./mycart.component.less']
})
export class MycartComponent implements OnInit {
    showCartItems = true;
    showDeliveryAddress = false;
    showAddresses = true;
    showPaymentMethode = false;
    showDeliveryType = false;
    addresses = false;
    constructor(public dialog: MatDialog, public appService: appService, private router: Router) { }

    ngOnInit() {
        this.getCart();
        this.getVouchers();
        this.getAdd();
        this.getSlots();
        this.paymentOptions();
    }

    showCart() {
        this.showCartItems = !this.showCartItems;
        this.showDeliveryAddress = false;
        this.showPaymentMethode = false;
    }
    itemIncrease(cartId) {

        for (var i = 0; i < this.cartData.length; i++) {
            if (this.cartData[i].cart_id === cartId) {
                this.cartData[i].quantity = this.cartData[i].quantity + 1;
                this.modifyCart(this.cartData[i].quantity, cartId);
                this.getCart();
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
                this.getCart();
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
                swal(resp.json().message, "", "success");
                // jQuery("#signupmodal").modal("hide");
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


    //show addrss
    showAddress() {
        this.showCartItems = false;
        this.showDeliveryAddress = !this.showDeliveryAddress;
        this.showPaymentMethode = false;
        this.addresses = false;
        this.showAddresses = true;
        this.showDeliveryType = false;
        window.scrollTo(0, 0);
    }
    addData = {
        full_name: "",
        mobile_number: "",
        house_no: "",
        city: "",
        state: "",
        landmark: "",
        pin_code: "",
        address_type: "",
        vendor_id: 44


    }
    //add address
    addAddress() {
        this.addresses = true;
        this.showAddresses = false;
    }
    saveAddress() {
        var inData = {
            "full_name": this.addData.full_name,
            "mobile_number": this.addData.mobile_number,
            "house_no": this.addData.house_no,
            "city": this.addData.city,
            "state": this.addData.state,
            "landmark": this.addData.landmark,
            "pin_code": this.addData.pin_code,
            "address_type": this.type,

        }
        this.appService.addaddress(inData).subscribe(res => {
            this.getAdd();
            this.showAddresses = true;
            this.addresses = false;

        })

    }
    type;
    Type(type) {
        this.type = type;
    }
    //save address


    //showPayment
    showPayment() {
        this.showPaymentMethode = !this.showPaymentMethode;
        this.showCartItems = false;
        this.showAddresses = false;
        this.showDeliveryAddress = false;
        window.scrollTo(0, 0);
    }
    payOptions = [];
    paymentOptions() {
        this.appService.paymentType().subscribe(res => {
            this.payOptions = res.json().options;
        }, err => {

        })
    }
    seleOpt;
    payId;
    selePayOptn(index, Id) {
        this.seleOpt = index;
        this.payId = Id;
    }

    // show shipment type
    shipmentType(addId) {
        this.addresses = false;
        this.showAddresses = false;
        this.showDeliveryType = true;
        this.addId = addId;
        this.selectAdd(this.addId);
    }
    selectAdd(id) {
        this.appService.setDelAdd(this.addId).subscribe(res => {
            swal("Selected successfully", "", "success");
            this.getAdd();
            this.getSlots();
        })
    }
    cartData = [];
    cartCount;
    billing;
    skuData = [];
    skuArr = [];
    offer_price;
    changeData(prodId) {
        this.getCart();
        for (var i = 0; i < this.cartData.length; i++) {
            // for(var j = 0;j<this.cartData[i].products;j++){
            for (var k = 0; k < this.cartData[i].products.sku_details.length; k++) {
                if (parseInt(prodId) === this.cartData[i].products.sku_details[k].skid) {
                    this.skuData = this.cartData[i].products.sku_details[k];
                    this.offer_price = this.cartData[i].products.sku_details[k].offer_price;
                }
            }
        }
    }
    getAddData = [];
    getAdd() {
        this.appService.getAddress().subscribe(res => {
            this.getAddData = res.json().delivery_address;
        }, err => {

        })
    };
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
                    this.cartData[i].products.actual_price = this.cartData[i].products.sku_details[0].actual_price;
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
    voucherData = [];
    getVouchers() {
        this.appService.getVouchers().subscribe(res => {
            if (res.json().message === "success") {
                this.voucherData = res.json().data;
            }

        }, err => {

        })
    }
    applyVoucher(vouCode) {
        var inData = {
            vocherCode: vouCode,
            amount: this.billing
        }
        this.appService.applyVoucher(inData).subscribe(res => {
            if (res.json().status === 200) {
                console.log(res.json());
                swal(res.json().message, "", "success");
            }
            if (res.json().status === 400) {
                swal(res.json().message, "", "error");
            }
        }, err => {
            swal(err.json().message, "", "error");
        });
    }
    selAdd;
    slotData;
    delSlots;
    getSlots() {
        this.appService.getSlots().subscribe(res => {
            if (res.json().status === 200) {
                this.selAdd = res.json().delivery_address[0];
                this.slotData = res.json();
                this.delSlots = res.json().delivery_slots;
                this.slotId = res.json().delivery_slots[0].id;
            }

        }, err => {
            swal(err.json().message, "", "error");
        });
    }
    proceed() {
        this.addresses = false;
        this.showAddresses = false;
        this.showDeliveryType = false;
        this.showPaymentMethode = true;
        this.showDeliveryAddress = false;
    }
    changeSlot(slot) {
        this.slotId = slot;
    }
    checkout() {
        this.showCartItems = false;
        this.showDeliveryAddress = true;
    }
    //items popup
    showItems() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        this.dialog.open(ItemsComponent, dialogConfig);

    }
    showPromos() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        this.dialog.open(PromocodesComponent, dialogConfig);

    }
    ordData;
    addId;
    slotId;
    orderPlace() {
        if (localStorage.userId === undefined) {
            swal('Please Login', '', 'warning');
            return;
          }
        var inData = {
            "delivery_address_id": this.addId,
            "billing_amount": this.billing,
            "payment_type": this.payId,
            "user_id": localStorage.getItem('userId'),
            "item_type": "grocery",
            "delivery_slot_id": this.slotId
        }
        this.appService.palceOrder(inData).subscribe(res => {
            if(res.json().message==="Success"){
                this.ordData = res.json().Order[0].order_id;
                swal(res.json().message, "", "success");
                this.router.navigate(['/Orderplaced'], { queryParams: { orderId: this.ordData } });
            }else {
                swal("Please Login", "", "warning");
            }
          
        }, err => {

        })
    }
}
