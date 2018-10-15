import React, { Component } from 'react';
import validator from 'validator';

class User extends Component {
    constructor(props){
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            address: '',
            zipCode: '',
            city: '',
            email: '',
            phone: '',
            comment: '',
            errors:{
                addressErr: '',
                emailErr: '',
                cityErr: '',
                phoneErr: '',
                zipCodeErr: '',
                lastNameErr: '',
                firstNameErr: ''
            },
            preloader: false,
            complete: false
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.preloader = this.preloader.bind(this);
        this.clearInfo = this.clearInfo.bind(this);
        this.checkErrors = this.checkErrors.bind(this);
        this.complete = this.complete.bind(this);
    }

    onChangeHandler(e){
        this.complete(false);
        const name = e.target.name;
        const value = e.target.value;
        this.setState((state) => {
            return {
                ...state,
                [name]: value
            }
        });
    }

    async submitHandler(e){
        e.preventDefault();
        this.complete(false);
        const { firstName, lastName, address, zipCode, city, email, phone, comment } = this.state;
        const data = {
            firstName,
            lastName,
            address,
            zipCode,
            city,
            email,
            phone,
            comment
        };

        this.checkErrors(()=>{
            const { errors } = this.state;
            if(Object.values(errors).every((item) => item === '')){
                this.preloader();
                fetch('http://localhost:5000/user',{
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(res =>{
                        this.clearInfo();
                        this.preloader();
                        this.complete(true);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }

        );
    }

    preloader(){
        this.setState((state) => {
            return {
                ...state,
                preloader: !state.preloader
            }
        })
    }

    complete(bool){
        this.setState((state) => {
            return {
                ...state,
                complete: bool
            }
        })
    }


    async checkErrors(callback){
        const { firstName, lastName, address, zipCode, city, email, phone } = this.state;

        const yaddress = await fetch(`http://www.yaddress.net/api/address?AddressLine1=${address}&AddressLine2=${city},${zipCode}&UserKey=`);
        const yaddressRes = await yaddress;
        const yaddressJson = await yaddressRes.json();
        console.log(yaddressJson);


        const errors = {};

        //Address validation
        if(address==='') {
            errors['addressErr'] = 'Address should not be blank';
        }
        if(yaddressJson.ErrorCode === 3){
            errors['addressErr'] = yaddressJson.ErrorMessage;
        }else{
            if(yaddressJson.ErrorCode === 2){
                errors['zipCodeErr'] = yaddressJson.ErrorMessage;
            }
        }
        //--------------------
        validator.isEmail(email)? errors['emailErr'] = '' : errors['emailErr'] = 'Email not valid';
        validator.isPostalCode(zipCode,'US')? errors['zipCodeErr'] = '' : errors['zipCodeErr'] = 'Zip code not valid';
        validator.isMobilePhone(phone,'en-US')? errors['phoneErr'] = '' : errors['phoneErr'] = 'Phone not valid';
        firstName !== '' ? errors['firstNameErr'] = '' : errors['firstNameErr'] = 'Name should not be blank';
        lastName !== '' ? errors['lastNameErr'] = '' : errors['lastNameErr'] = 'Last name should not be blank';

        this.setState((state) => {
            return {
                ...state,
                errors
            }
        },callback);

    }

    clearInfo() {
        this.setState({
            firstName: '',
            lastName: '',
            address: '',
            zipCode: '',
            city: '',
            phone: '',
            comment: '',
            email: ''
        });
    }



    render() {
        const { firstName, lastName, address, zipCode, city, email, phone, comment, preloader, complete } = this.state;
        const { addressErr, emailErr, cityErr,phoneErr, zipCodeErr, lastNameErr, firstNameErr } = this.state.errors;
        return(
            <div className="user">
                { preloader ? <div className="preloader">Loading...</div> : '' }
                <h2>Please, fill up your shipping information!</h2>
                <form action="" className="userForm" name="userForm" onSubmit={this.submitHandler}>
                   <div className="inputBlock">
                       <input type="text" name="firstName" placeholder="First name" value={firstName} onChange={this.onChangeHandler}/>
                       <div className="error">{firstNameErr}</div>
                   </div>
                   <div className="inputBlock">
                       <input type="text" name="lastName" placeholder="Last name" value={lastName} onChange={this.onChangeHandler}/>
                       <div className="error">{lastNameErr}</div>
                   </div>
                    <div className="inputBlock">
                        <input type="text" name="address" placeholder="Street, floor, apartment, etc." value={address} onChange={this.onChangeHandler}/>
                        <div className="error">{addressErr}</div>
                    </div>
                    <div className="inputBlock">
                        <input type="text" name="zipCode" placeholder="Zip code" value={zipCode} onChange={this.onChangeHandler}/>
                        <div className="error">{zipCodeErr}</div>
                    </div>
                    <div className="inputBlock">
                        <input type="text" name="city" placeholder="City" value={city} onChange={this.onChangeHandler}/>
                        <div className="error">{cityErr}</div>
                    </div>
                    <div className="inputBlock">
                        <input type="text" name="email" placeholder="Email" value={email} onChange={this.onChangeHandler}/>
                        <div className="error">{emailErr}</div>
                    </div>
                    <div className="inputBlock">
                        <input type="text" name="phone" placeholder="Phone" value={phone} onChange={this.onChangeHandler}/>
                        <div className="error">{phoneErr}</div>
                    </div>
                    <textarea name="comment" id="" cols="30" rows="10"  placeholder="Leave your comment here" maxLength="500" value={comment} onChange={this.onChangeHandler}>
                    </textarea>
                    {complete ?  <div className="complete">You information is accepted. Thank you for your order :)</div> :  '' }
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        )
    }

}

export default User;