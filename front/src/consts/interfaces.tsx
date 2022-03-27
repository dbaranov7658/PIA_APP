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
    comments: comment[]
}


interface piaInfo{
    pia: pia,
    status: string,
    date: Date,
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

interface comment{
    author: string,
    content: string,
    date: string
}

export {
    pia,
    piaInfo,
    tableData,
    comment
};