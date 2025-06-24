# Glamsquad AI Assistant

## Overview

This is the Glamsquad AI assistant that uses the Glamsquad API to answer questions about services, book appointments, and update appointments. The AI assistant also integrates with Algolia to search the Gorgias help center articles and can create support tickets using the Gorgias API. The AI assistant is designed to use the authToken of the logged in Glamsquad user to authenticate them and make queries on their behalf.

## Getting Started

```bash
yarn install && npm run dev
```

## Tech Stack

This AI assistant was built using:
- **Next.js** - React framework for the web application
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Vercel AI SDK** - AI toolkit for building conversational interfaces
- **OpenAI GPT-4.1** - Large language model for natural language processing
- **React 19** - Latest React version for the frontend
- **TypeScript** - Type-safe JavaScript for better development experience
- **Radix UI** - Accessible component library for UI elements
- **GraphQL** - Query language for API communications

## AI Tool Calls

### Service Availability Checker
This tool queries availability for beauty services at specific times and locations. It takes service IDs, add-on services, address details, and desired appointment times to return available slots with booking tokens from the Glamsquad API.

### User Account Manager
This tool retrieves the current user's account information, including their profile details, saved addresses, and appointment history. It uses the user's email to fetch personalized data from the Glamsquad API.

### Service Catalog Browser
This tool lists all available beauty services by market or location. It queries the Glamsquad API to return services with pricing, duration, and available add-on options for a specific market area.

### Appointment Booking Assistant
This tool handles appointment creation by collecting booking parameters like start time, services, address, and pricing. It prepares appointment confirmation details for user approval rather than directly booking to ensure user consent.

### Appointment Rescheduler
This tool manages appointment rescheduling for existing bookings. It takes appointment IDs, new times, and booking tokens to prepare rescheduling parameters that require user confirmation before processing.

### Knowledge Base Search
This tool answers questions about company services, policies, and information by searching through the knowledge base using Algolia. It processes search results with AI to provide accurate, contextual responses based on official company documentation.

### Support Ticket Creator
This tool creates customer support tickets through the Gorgias API. It collects user information and issue details to generate support tickets for customer service follow-up and resolution.

## Hosting

This project is hosted on Vercel.
