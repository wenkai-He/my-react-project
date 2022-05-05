export const CollapsedReducer=(preState={
    isCollapsed:false
},action)=>{
    let {type}=action
    switch(type){
        case "change_collapsed":
            let newstate={...preState}
            newstate.isCollapsed=!newstate.isCollapsed
            return newstate
        default:
            return preState
    }
}