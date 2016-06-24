import * as types from './actionTypes';

export function storeRoute(id){
  return {
    type: types.STORED_ROUTE,
    id
  };
}

export function initialize(){
  return {type: types.INITIALIZED};
}

export function testCall(id){
  console.log("testCall");
  console.log(types);
  return {
    type: types.STORED_ROUTE,
    id
  };
}