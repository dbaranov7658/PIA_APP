interface pia{
    projectName: string
    sponsoringBusinessUnit: string
    projectDescription: string
    isCollected: boolean
    personalInfo?: string
    purpose: string
    individualsInfo: string
    isDisclosed: boolean
    disclosedInfo?: string
}


interface piaInfo{
    pia: pia,
    status: string,
    date: Date,
    comments: string,
    createdAt: string,
    updatedAt: string,
    creator: string,
    __v: number,
    _id: string
}

interface tableData{
    key: string,
    name: string,
    status: string,
    submission_date: string
}

export {
    pia,
    piaInfo,
    tableData
};