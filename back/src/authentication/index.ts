import { User } from '../models';
import { bcrypt } from 'bcryptjs';
import express = require( 'express' );

export const createUser = ( newUser, callback ) => {
    bcrypt.genSalt(10, ( err, salt ) => {
        bcrypt.hash(newUser.password, salt, ( err, hash ) => {
        newUser.password = hash;
        newUser.save( callback );
        });
    });
}

export const comparePassword = ( candidatePassword, hash, callback ) => {
    bcrypt.compare(candidatePassword, hash, ( err, isMatch ) => {
        if( err ) throw err;
        callback( undefined, isMatch );
    });
}