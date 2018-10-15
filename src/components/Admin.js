import React, { Component } from 'react';
import InfoTable from './InfoTable';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        fetch('http://localhost:5000/admin')
            .then(res => res.json())
            .then(json => this.setState((state) => {
                return {
                    ...state,
                    users: json
                }
            })).catch((err) => {
            console.log(err);
        });
    }


    render() {
         const { users } = this.state;
        return(
            <div>
               <InfoTable data={users} />
            </div>
        )
    }

}

export default Admin;