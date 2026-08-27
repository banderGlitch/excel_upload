/**
 * Mock API database — same shape as future backend responses.
 * See src/api/contracts.js for PoolRecord / PoolTemplate contracts.
 *
 * PoolRecord:
 * {
 *   id: string,
 *   values: { [columnKey]: string },
 *   status: 'received' | 'validated' | 'failed',
 *   remark: string,
 *   errorKeys: string[]
 * }
 */
import type { PoolRecord } from './contracts'

export const MOCK_API_RECORDS: Record<string, PoolRecord[]> = {
  "employee-pool": [
    {
      "id": "emp-1",
      "values": {
        "employeeId": "EMP0001",
        "fullName": "Aisha Khan",
        "email": "aisha.khan@company.com",
        "gender": "Female",
        "department": "Engineering",
        "role": "Developer",
        "joinDate": "2023-04-12"
      },
      "status": "validated",
      "remark": "",
      "errorKeys": []
    },
    {
      "id": "emp-2",
      "values": {
        "employeeId": "EMP0002",
        "fullName": "Rohan Mehta",
        "email": "not-an-email",
        "gender": "Male",
        "department": "Design",
        "role": "UI Designer",
        "joinDate": "2022-11-03"
      },
      "status": "failed",
      "remark": "Email format is invalid,",
      "errorKeys": [
        "email"
      ]
    },
    {
      "id": "emp-3",
      "values": {
        "employeeId": "EMP0003",
        "fullName": "Priya Sharma",
        "email": "priya.sharma@company.com",
        "gender": "Unknown",
        "department": "HR",
        "role": "Recruiter",
        "joinDate": "2024-01-20"
      },
      "status": "failed",
      "remark": "Gender must be Male, Female, or Other",
      "errorKeys": [
        "gender"
      ]
    },
    {
      "id": "emp-4",
      "values": {
        "employeeId": "EMP0004",
        "fullName": "Vikram Patel",
        "email": "bad@",
        "gender": "N/A",
        "department": "Sales",
        "role": "Manager",
        "joinDate": "32/13/2020"
      },
      "status": "failed",
      "remark": "Invalid email, gender, and join date",
      "errorKeys": [
        "email",
        "gender",
        "joinDate"
      ]
    },
    {
      "id": "emp-5",
      "values": {
        "employeeId": "EMP0005",
        "fullName": "Neha Gupta",
        "email": "neha.gupta@company.com",
        "gender": "Female",
        "department": "Finance",
        "role": "Analyst",
        "joinDate": "2023-09-01"
      },
      "status": "validated",
      "remark": "",
      "errorKeys": []
    },
    {
      "id": "emp-6",
      "values": {
        "employeeId": "EMP0006",
        "fullName": "Arjun Nair",
        "email": "arjun.nair@company.com",
        "gender": "Male",
        "department": "Engineering",
        "role": "DevOps",
        "joinDate": "13/40/2022"
      },
      "status": "failed",
      "remark": "Join date is not a valid calendar date",
      "errorKeys": [
        "joinDate"
      ]
    },
    {
      "id": "emp-7",
      "values": {
        "employeeId": "EMP0007",
        "fullName": "Sana Ali",
        "email": "sana.ali@company.com",
        "gender": "Female",
        "department": "Marketing",
        "role": "Content Lead",
        "joinDate": "2024-05-10"
      },
      "status": "validated",
      "remark": "",
      "errorKeys": []
    },
    {
      "id": "emp-8",
      "values": {
        "employeeId": "EMP0008",
        "fullName": "Kabir Singh",
        "email": "kabir.singh",
        "gender": "Male",
        "department": "Finance",
        "role": "Analyst",
        "joinDate": "2023-07-22"
      },
      "status": "failed",
      "remark": "Email is missing domain",
      "errorKeys": [
        "email"
      ]
    },
    {
      "id": "emp-9",
      "values": {
        "employeeId": "EMP0009",
        "fullName": "Ananya Reddy",
        "email": "ananya.reddy@company.com",
        "gender": "Other",
        "department": "Product",
        "role": "PM",
        "joinDate": "2021-08-15"
      },
      "status": "received",
      "remark": "",
      "errorKeys": []
    },
    {
      "id": "emp-10",
      "values": {
        "employeeId": "EMP0010",
        "fullName": "Dev Iyer",
        "email": "dev.iyer@company.com",
        "gender": "X",
        "department": "Support",
        "role": "Specialist",
        "joinDate": "2020-02-28"
      },
      "status": "failed",
      "remark": "Gender value is not allowed",
      "errorKeys": [
        "gender"
      ]
    },
    {
      "id": "emp-11",
      "values": {
        "employeeId": "EMP0011",
        "fullName": "Meera Joshi",
        "email": "meera@",
        "gender": "Female",
        "department": "Legal",
        "role": "Counsel",
        "joinDate": "99/99/9999"
      },
      "status": "failed",
      "remark": "Email and join date failed validation",
      "errorKeys": [
        "email",
        "joinDate"
      ]
    },
    {
      "id": "emp-12",
      "values": {
        "employeeId": "EMP0012",
        "fullName": "Ishaan Das",
        "email": "ishaan.das@company.com",
        "gender": "Male",
        "department": "Operations",
        "role": "Lead",
        "joinDate": "2022-06-18"
      },
      "status": "received",
      "remark": "",
      "errorKeys": []
    }
  ],
  "product-pool": [
    {
      "id": "prd-1",
      "values": {
        "sku": "SKU-00001",
        "productName": "Laptop Stand",
        "category": "Accessories",
        "stock": "120",
        "unitPrice": "45.00",
        "supplier": "TechSupply Co"
      },
      "status": "validated",
      "remark": "",
      "errorKeys": []
    },
    {
      "id": "prd-2",
      "values": {
        "sku": "SKU-00002",
        "productName": "USB-C Hub",
        "category": "Electronics",
        "stock": "many",
        "unitPrice": "39.00",
        "supplier": "Global Traders"
      },
      "status": "failed",
      "remark": "Stock must be a number",
      "errorKeys": [
        "stock"
      ]
    },
    {
      "id": "prd-3",
      "values": {
        "sku": "SKU-00003",
        "productName": "Notebook",
        "category": "Stationery",
        "stock": "300",
        "unitPrice": "free",
        "supplier": "Prime Parts"
      },
      "status": "failed",
      "remark": "Unit price must be numeric",
      "errorKeys": [
        "unitPrice"
      ]
    },
    {
      "id": "prd-4",
      "values": {
        "sku": "SKU-00004",
        "productName": "Wireless Mouse",
        "category": "Electronics",
        "stock": "n/a",
        "unitPrice": "abc",
        "supplier": "Nova Distributors"
      },
      "status": "failed",
      "remark": "Stock and unit price are invalid",
      "errorKeys": [
        "stock",
        "unitPrice"
      ]
    },
    {
      "id": "prd-5",
      "values": {
        "sku": "SKU-00005",
        "productName": "Desk Lamp",
        "category": "Furniture",
        "stock": "80",
        "unitPrice": "25.50",
        "supplier": "Apex Wholesale"
      },
      "status": "validated",
      "remark": "",
      "errorKeys": []
    },
    {
      "id": "prd-6",
      "values": {
        "sku": "SKU-00006",
        "productName": "HDMI Cable",
        "category": "Electronics",
        "stock": "500",
        "unitPrice": "12.00",
        "supplier": "Blue Ocean Ltd"
      },
      "status": "received",
      "remark": "",
      "errorKeys": []
    },
    {
      "id": "prd-7",
      "values": {
        "sku": "SKU-00007",
        "productName": "Office Chair",
        "category": "Furniture",
        "stock": "forty",
        "unitPrice": "199.00",
        "supplier": "Summit Goods"
      },
      "status": "failed",
      "remark": "Stock is not numeric",
      "errorKeys": [
        "stock"
      ]
    },
    {
      "id": "prd-8",
      "values": {
        "sku": "SKU-00008",
        "productName": "Pen Pack",
        "category": "Stationery",
        "stock": "1000",
        "unitPrice": "3.25",
        "supplier": "Urban Mart"
      },
      "status": "validated",
      "remark": "",
      "errorKeys": []
    },
    {
      "id": "prd-9",
      "values": {
        "sku": "SKU-00009",
        "productName": "Monitor Arm",
        "category": "Accessories",
        "stock": "60",
        "unitPrice": "--",
        "supplier": "TechSupply Co"
      },
      "status": "failed",
      "remark": "Unit price format is invalid",
      "errorKeys": [
        "unitPrice"
      ]
    },
    {
      "id": "prd-10",
      "values": {
        "sku": "SKU-00010",
        "productName": "Keyboard",
        "category": "Electronics",
        "stock": "150",
        "unitPrice": "49.99",
        "supplier": "Global Traders"
      },
      "status": "validated",
      "remark": "",
      "errorKeys": []
    }
  ],
  "vendor-pool": [
    {
      "id": "ven-1",
      "values": {
        "vendorCode": "ACME0001",
        "vendorName": "ACME Industries",
        "contactPerson": "Ravi Shah",
        "phone": "+91 9876543210",
        "email": "ravi@acme.com",
        "city": "Mumbai",
        "status": "Active"
      },
      "status": "validated",
      "remark": "",
      "errorKeys": []
    },
    {
      "id": "ven-2",
      "values": {
        "vendorCode": "NOVA0002",
        "vendorName": "Nova Solutions",
        "contactPerson": "Lina Rao",
        "phone": "abc",
        "email": "lina@nova.com",
        "city": "Delhi",
        "status": "Inactive"
      },
      "status": "failed",
      "remark": "Phone number is invalid",
      "errorKeys": [
        "phone"
      ]
    },
    {
      "id": "ven-3",
      "values": {
        "vendorCode": "PEAK0003",
        "vendorName": "Peak Corp",
        "contactPerson": "Omar Ali",
        "phone": "+91 9123456780",
        "email": "bad@",
        "city": "Bengaluru",
        "status": "Pending"
      },
      "status": "failed",
      "remark": "Email format is invalid",
      "errorKeys": [
        "email"
      ]
    },
    {
      "id": "ven-4",
      "values": {
        "vendorCode": "LUNA0004",
        "vendorName": "Luna Pvt Ltd",
        "contactPerson": "Sneha Jain",
        "phone": "12",
        "email": "sneha@",
        "city": "Pune",
        "status": "Active"
      },
      "status": "failed",
      "remark": "Phone, email, and status are invalid",
      "errorKeys": [
        "phone",
        "email",
        "status"
      ]
    },
    {
      "id": "ven-5",
      "values": {
        "vendorCode": "ORBIT0005",
        "vendorName": "Orbit Enterprises",
        "contactPerson": "Karan Verma",
        "phone": "+91 9988776655",
        "email": "karan@orbit.com",
        "city": "Hyderabad",
        "status": "Inactive"
      },
      "status": "validated",
      "remark": "",
      "errorKeys": []
    },
    {
      "id": "ven-6",
      "values": {
        "vendorCode": "PULSE0006",
        "vendorName": "Pulse Traders",
        "contactPerson": "Nisha Kapoor",
        "phone": "+91 9001122334",
        "email": "nisha@pulse.com",
        "city": "Chennai",
        "status": "Active"
      },
      "status": "received",
      "remark": "",
      "errorKeys": []
    },
    {
      "id": "ven-7",
      "values": {
        "vendorCode": "VERTEX0007",
        "vendorName": "Vertex Goods",
        "contactPerson": "Aman Bose",
        "phone": "+91 8899001122",
        "email": "aman@vertex.com",
        "city": "Kolkata",
        "status": "Pending"
      },
      "status": "failed",
      "remark": "Status must be Active, Inactive, or Pending",
      "errorKeys": [
        "status"
      ]
    },
    {
      "id": "ven-8",
      "values": {
        "vendorCode": "NEXUS0008",
        "vendorName": "Nexus Supply",
        "contactPerson": "Diya Malhotra",
        "phone": "call-me",
        "email": "diya@nexus.com",
        "city": "Jaipur",
        "status": "Active"
      },
      "status": "failed",
      "remark": "Phone number format failed",
      "errorKeys": [
        "phone"
      ]
    },
    {
      "id": "ven-9",
      "values": {
        "vendorCode": "ATLAS0009",
        "vendorName": "Atlas Wholesale",
        "contactPerson": "Yash Chopra",
        "phone": "+91 9112233445",
        "email": "yash.atlas",
        "city": "Ahmedabad",
        "status": "Inactive"
      },
      "status": "failed",
      "remark": "Email is incomplete",
      "errorKeys": [
        "email"
      ]
    },
    {
      "id": "ven-10",
      "values": {
        "vendorCode": "QUANTUM0010",
        "vendorName": "Quantum Ltd",
        "contactPerson": "Tanvi Shah",
        "phone": "+91 9334455667",
        "email": "tanvi@quantum.com",
        "city": "Kochi",
        "status": "Active"
      },
      "status": "validated",
      "remark": "",
      "errorKeys": []
    }
  ]
}
