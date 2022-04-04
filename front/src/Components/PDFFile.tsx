import React from 'react';
import {Page,Text,Image,Document, StyleSheet} from '@react-pdf/renderer';

//const styles = StyleSheet.create({});

const PDFFile = () =>{
    return (
        <Document>
            <Page>
                <Text>TEXT</Text>
            </Page>
        </Document>
    )
};

export default PDFFile;