package com.debtflow.mapper.exception;


public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}