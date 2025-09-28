import { Layout } from '@/components/layout/Layout'
import DashboardTemplate from '@/components/templates/dashboardTemplate/DashboardTemplate'
import React from 'react'

const page = () => {
    return (
        <div>
            <Layout>
                <DashboardTemplate />
            </Layout>
        </div>
    )
}

export default page
