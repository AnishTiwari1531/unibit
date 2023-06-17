const Ticket = require('../models/tambulaModel');

// const createTicket = async (req, res) => {
//     try {
//         const { numberOfTickets } = req.body;
//         // Generate unique ticket IDs
//         const ticketIds = [];

//         for (let i = 0; i < numberOfTickets; i++) {
//             const ticket = new Ticket();
//             const ticketId = generateUniqueId(); // Implement your own logic to generate a unique ID
//             ticket.ticketId = ticketId;

//             // Generate numbers for the ticket
//             ticket.numbers = generateTicketNumbers(); // Implement your own logic to generate ticket numbers

//             await ticket.save();
//             ticketIds.push(ticketId);
//         }

//         res.status(201).json({ ticketIds });
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to create tickets' });
//     }
// };

// const fetchTickets = async (req, res) => {
//     try {
//         const { page, limit } = req.query;

//         const options = {
//             page: parseInt(page, 10) || 1,
//             limit: parseInt(limit, 10) || 10,
//             sort: { createdAt: -1 } // Sort by creation date in descending order
//         };

//         const tickets = await Ticket.paginate({}, options);

//         res.json(tickets);
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to fetch tickets' });
//     }
// };


// Tambula ticket creation API:

// Import necessary modules and dependencies
// Tambula ticket creation API
const createTicket = (req, res) => {
    const { numberOfTickets } = req.body;

    // Generate the specified number of unique Tambula tickets
    const tickets = generateTickets(numberOfTickets);

    // Save the generated tickets in the database
    saveTickets(tickets)
        .then(savedTickets => {
            // Return the unique ticket ID(s) as a response
            const ticketIds = savedTickets.map(ticket => ticket._id);
            console.log(ticketIds)
            res.json({ ticketIds });
        })
        .catch(error => {
            console.error('Error saving tickets:', error);
            res.status(500).json({ message: 'Failed to save tickets' });
        });
};


// Save the generated tickets in the database
// function saveTickets(tickets) {
//     return new Promise((resolve, reject) => {
//         // Implementation of saving tickets to the database
//         // (e.g., using an ORM or MongoDB driver) goes here

//         // For demonstration purposes, assume the tickets are saved successfully
//         const savedTickets = tickets;

//         // Resolve the promise with the saved tickets
//         resolve(savedTickets);
//     });
// }


function saveTickets(tickets) {
    return new Promise((resolve, reject) => {
      const savedTickets = [];
  
      const saveTicketPromises = tickets.map(ticket => {
        const ticketModel = new Ticket(ticket); // Create a new Mongoose ticket model instance
        return ticketModel.save(); // Save the ticket model to the database
      });
  
      Promise.all(saveTicketPromises)
        .then(savedTicketDocs => {
          savedTickets.push(...savedTicketDocs);
          resolve(savedTickets);
        })
        .catch(error => {
          reject(error);
        });
    });
  }


//   Ticket Generation:

// Generate a single Tambula ticket
function generateTicket() {
    const ticket = [];
    const columnRanges = [1, 10, 20, 30, 40, 50, 60, 70, 80];

    for (let i = 0; i < 9; i++) {
        const column = [];
        for (let j = 0; j < 3; j++) {
            let num;
            if (i === 8 && j === 2) {
                num = getRandomNumber(columnRanges[i], columnRanges[i] + 10);
            } else {
                num = getRandomNumber(columnRanges[i], columnRanges[i + 1]);
            }
            column.push(num);
        }
        ticket.push(column);
    }

    return ticket;
}

// Generate a random number within a given range
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Generate the specified number of unique Tambula tickets
function generateTickets(numberOfTickets) {
    const tickets = [];

    while (tickets.length < numberOfTickets) {
        const ticket = generateTicket();

        // Check if the generated ticket already exists
        const isDuplicate = tickets.some(existingTicket => {
            return JSON.stringify(existingTicket) === JSON.stringify(ticket);
        });

        // If the ticket is unique, add it to the list
        if (!isDuplicate) {
            tickets.push(ticket);
        }
    }

    return tickets;
}


module.exports = { createTicket };
// module.exports = { createTicket, fetchTickets };