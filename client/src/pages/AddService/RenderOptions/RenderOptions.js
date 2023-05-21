import React,{Fragment} from 'react'

const RenderOptions = ({data}) => {
    return (
        <Fragment>

{data.map((op)=>{
  return <option value={op.cat_id}>{op.cat_name}</option>

})}
        </Fragment>
    )
}

export default RenderOptions
