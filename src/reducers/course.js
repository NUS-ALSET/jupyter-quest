import { Course_Join,
    Course_Join_Fail,
    Course_Join_Success
 } from '../app-constant';

const initial_state = {
    passwordMatchSuccess:false,
    passwordMatchLoading:false,
    passwordMatchFail:false   
}

const CourseReducer = (state = initial_state, action) => {

    switch (action.type) {
            case Course_Join :{
                return{...state, passwordMatchLoading:true, passwordMatchSuccess: false}
            }
            case Course_Join_Success :{
                return{...state, passwordMatchLoading:false, passwordMatchSuccess:action.payload.status}
            }
            case Course_Join_Fail :{
                return{...state, passwordMatchLoading:false, passwordMatchSuccess:false}
            }
            default:
            return state
        }
}
export default CourseReducer
