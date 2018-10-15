import React from 'react'
import { Icon, Label, Menu, Table } from 'semantic-ui-react'

const InfoTable = (props) => {
    let tableHeaderNames;
    let headers;
    let rows;
    if(props.data.length>0){
        tableHeaderNames = props.data[0];
        headers = Object.keys(tableHeaderNames).map((head,index)=>{
            return  <Table.HeaderCell key={index}>{head}</Table.HeaderCell>
        });

        rows = props.data.map((row, index) => {
           const cells = Object.values(row).map((item, index) => {
             return  <Table.Cell key={index}>{item}</Table.Cell>
            });
            return (<Table.Row key={index}>
                {cells}
            </Table.Row>)
        })
    }

    return(
        <Table celled>
            <Table.Header>
                <Table.Row>
                    {headers ? headers : <Table.HeaderCell>Loading...</Table.HeaderCell>}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {rows}
            </Table.Body>
        </Table>
    )
};

export default InfoTable;