import React , {useState} from "react";

import HashLoader from "react-spinners/HashLoader";
function Loader() {
  let [loading,setloading] = useState(true);
 
  return (
    <div className="sweet-loading text-center" style={{marginTop:'150px'}}>
      <HashLoader color={'#256395'} loading={true} css='' size={80} />
    </div>
  );
}

export default Loader;
