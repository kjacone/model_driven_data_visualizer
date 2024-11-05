// data/chinookData.ts

interface Artist {
    artistId: number;
    name: string;
  }
  
  interface Album {
    albumId: number;
    title: string;
    artistId: number;
  }
  
  interface Track {
    trackId: number;
    name: string;
    albumId: number;
    genre: string;
  }
  
  interface Customer {
    customerId: number;
    name: string;
    email: string;
  }
  
  interface Invoice {
    invoiceId: number;
    customerId: number;
    total: number;
    date: string;
  }
  
  export const chinookData = {
    artists: [
      { artistId: 1, name: "AC/DC" },
      { artistId: 2, name: "Accept" },
    ] as Artist[],
    albums: [
      { albumId: 1, title: "For Those About To Rock", artistId: 1 },
      { albumId: 2, title: "Balls to the Wall", artistId: 2 },
    ] as Album[],
    tracks: [
      { trackId: 1, name: "For Those About To Rock", albumId: 1, genre: "Rock" },
      { trackId: 2, name: "Balls to the Wall", albumId: 2, genre: "Metal" },
    ] as Track[],
    customers: [
      { customerId: 1, name: "John Doe", email: "john@example.com" },
      { customerId: 2, name: "Jane Smith", email: "jane@example.com" },
    ] as Customer[],
    invoices: [
      { invoiceId: 1, customerId: 1, total: 14.99, date: "2024-11-01" },
      { invoiceId: 2, customerId: 2, total: 19.99, date: "2024-11-02" },
    ] as Invoice[],
  };
  