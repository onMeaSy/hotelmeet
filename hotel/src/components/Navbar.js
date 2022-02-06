import React from 'react'

function navbar() {


    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    return (
        <div>
            <nav class="navbar navbar-expand-lg">
                <a class="navbar-brand" href="/home">
                    Shey Rooms
                </a>


                {user ?  (
            <div class="dropdown mr-5">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fa fa-user" ></i>  {JSON.parse(sessionStorage.getItem('currentUser')).name} 
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" href="/profile">Profile</a>
              <a class="dropdown-item" href="#"  >Logout</a>
            </div>
          </div>

          )  : (<>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/login">Login</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/register">Register</a>
                        </li>



                    </ul>
                    
                </div>
                </>)}
                
            </nav>
        </div>
    )
}

export default navbar

//

//{user ? (<><h1 style = {{color:'white'}}>{user.name}</h1></>) : (<>
//</>)}