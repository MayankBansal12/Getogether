import React, { useState, useEffect } from 'react'
import Table from '../assets/table.svg'
import Button from './button'
import { useEventStore, useUserStore } from '../global-store/store'
import { Modal } from '@mui/material'
import useApi from '../hooks/use-api'
import useSnackbar from '../hooks/use-snackbar'

const BookTable = () => {
  const [isMobile, setIsMobile] = useState(false)
  const { event } = useEventStore(state => state)
  const { user } = useUserStore(state => state)
  const [bookTable, setBookTable] = useState({
    row: 0,
    col: 0
  });
  const [bookedTable, setBookedTable] = useState([]);
  const [userTable, setUserTable] = useState([]);
  const setSnackbar = useSnackbar()
  const [showTable, setShowTable] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const callApi = useApi();

  const isTableBooked = (row: number, col: number) => {
    return bookedTable.some(table => table.row === row && table.col === col);
  };

  const handleResize = () => {
    // Check if the screen width is small (sm) or extra small (xs)
    setIsMobile(window.innerWidth < 768) // Tailwind's 'sm' breakpoint is at 640px and 'md' is at 768px
  }

  const fetchUserTables = async () => {
    if (!user || !event || !user.id || !event.id) {
      console.log("error fetching user tables, ids missing!");
      return;
    }
    try {
      const res = await callApi("/table/user", "POST", { userId: user.id, eventId: event.id })
      setUserTable(res?.data?.tables);
    } catch (error) {
      console.log("error fetching user tables", error);
      setSnackbar({
        open: true,
        content: 'Error fetching user tables, refresh and try again!',
        type: 'error',
      });
    }
  }

  const handleBookTable = async (e) => {
    e.preventDefault();

    try {
      if (!bookTable || !bookTable.row || !bookTable.col) {
        setSnackbar({
          open: true,
          content: 'Error booking table, refresh and try again!',
          type: 'error',
        })
        return;
      }
      const requestData = { eventId: event.id, userId: user.id, row: bookTable.row, col: bookTable.col }
      const res = await callApi("/table/assign", "POST", requestData)
      if (res.status === 201) {
        setBookedTable((prev) => [...prev, { ...requestData }])
        setUserTable((prev) => [...prev, { ...requestData }])
        setSnackbar({
          open: true,
          content: 'Table booked for the event!',
          type: 'success',
        })
      } else {
        setSnackbar({
          open: true,
          content: res.data.message + " Refresh the page and try again!",
          type: 'error',
        });
      }
    } catch (error) {
      console.log(error, error?.data?.message)
      setSnackbar({
        open: true,
        content: error?.data?.message || 'Error while booking table!',
        type: 'error',
      })
    } finally {
      setBookTable({ row: 0, col: 0 })
      handleClose()
    }
  }

  const handleCancelTable = async (e, row: number, col: number) => {
    e.preventDefault();

    try {
      const requestData = { eventId: event.id, userId: user.id, row: row, col: col }
      const res = await callApi("/table/assign", "DELETE", requestData)
      if (res.status === 200) {
        setBookedTable(prevBookedTables => prevBookedTables.filter(table => !(table.row === row && table.col === col)));
        setSnackbar({
          open: true,
          content: 'Table cancelled for the event!',
          type: 'success',
        });
        window.location.reload();
      }
    } catch (error) {
      console.log(error, error?.data?.message)
      setSnackbar({
        open: true,
        content: error?.data?.message || 'Error while booking table!',
        type: 'error',
      })
    } finally {
      setBookTable({ row: 0, col: 0 })
      handleClose()
    }
  }

  useEffect(() => {
    setBookedTable(event?.EventTable?.SingleTable);
    fetchUserTables()
    handleResize() // Initial check
    window.addEventListener('resize', handleResize) // Add event listener for resize
    return () => {
      window.removeEventListener('resize', handleResize) // Cleanup the event listener on component unmount
    }
  }, [])

  const generateGrid = (rowSize = 0, colSize = 0, totalNo = 0) => {
    const rows = [];
    let count = 0;

    if (totalNo === 0) {
      return rows;
    }

    for (let i = 1; i <= rowSize; i++) {
      const rowElements = [];
      for (let j = 1; j <= colSize; j++) {
        if (count >= totalNo) break;

        const button = !isTableBooked(i, j) ? (
          <button
            key={`${i}_${j}`}
            className="border-2 hover:border-2 hover:bg-[#DED9FF] transition-all mx-2 md:mx-4 my-2 md:my-4 px-2"
            onClick={() => {
              handleOpen();
              setBookTable({ row: i, col: j });
            }}
          >
            <div className="flex justify-center items-center">
              {/* First Table */}
              <img
                src={Table}
                alt="Table"
                className={`mx-2 ${isMobile ? 'size-6' : 'size-12'}`}
              />
              {/* Second Table Flipped Horizontally */}
              <img
                src={Table}
                alt="Flipped Table"
                className={`mx-2 transform scale-x-[-1] ${isMobile ? 'size-6' : 'size-12'
                  }`}
              />
            </div>
          </button>
        ) : (
          <button
            disabled
            key={`${i}_${j}`}
            className="flex justify-center items-center border-2 border-gray-300 hover:border-gray-300 bg-gray-200 mx-2 md:mx-4 my-2 md:my-4 px-2 text-gray-500 cursor-not-allowed"
          >
            <img
              src={Table}
              alt="Table"
              className={`mx-2 ${isMobile ? 'w-6 h-6' : 'size-12'}`}
            />
            <img
              src={Table}
              alt="Flipped Table"
              className={`mx-2 transform scale-x-[-1] ${isMobile ? 'w-6 h-6' : 'size-12'
                }`}
            />
          </button>
        );

        rowElements.push(button);
        count++;
      }
      rows.push(<div key={`row_${i}`} className="flex flex-wrap">{rowElements}</div>);
      if (count >= totalNo) break;
    }

    return rows;
  };

  return (
    <>
      <div className="flex flex-col gap-3 px-4 py-6 font-josefin text-center">
        <p className="font-bold text-4xl">Book Your Table!</p>
        <p className="font-medium text-xl">
          Join us for a celebration to remember! We can't wait to celebrate with
          you at our special event! 🤗
        </p>
        <span className="text-xl">
          Just click on the button and book your table.
        </span>
        <p>
          <span className="font-semibold">Total Table: {event?.EventTable?.table_size || 0} | Already Booked Table: {bookedTable?.length || 0} | </span>
          <span className="underline cursor-pointer" onClick={() => setShowTable(true)}>Click here to see your Booked Tables</span>
        </p>
        <Modal
          open={showTable}
          onClose={() => setShowTable(false)}
          className="flex justify-center items-center rounded-lg"
        >
          <div className="bg-white w-1/2 h-1/2 flex flex-col gap-4 text-center px-4 py-4 font-josefin">
            <h2 className="text-lg font-semibold">Table Booked by {user?.name || "You"}..</h2>
            {userTable.length <= 0 ? <div>
              No tables booked!
            </div>
              :
              <div className="grid justify-center items-center text-center grid-cols-3 gap-4 overflow-y-scroll">
                {userTable.map((table, i) => (
                  <div className="flex flex-col gap-1" key={i}>
                    <span>Row No: {table?.row}</span>
                    <span>Col No: {table?.col}</span>
                    <button onClick={(e) => handleCancelTable(e, table?.row, table?.col)} className="bg-primary-light px-2 py-1 rounded-md text-white cursor-pointer">
                      Leave Table
                    </button>
                  </div>
                ))}
              </div>
            }
          </div>
        </Modal>
      </div>
      {event.bookTable ?
        <div className="flex md:flex-row flex-col justify-center space-x-4">
          {event?.EventTable?.table_size <= 0 ?
            <p className="text-center font-medium text-lg">No tables to show!</p> :
            <div className={`grid justify-center items-center text-center`}>
              {generateGrid(event?.EventTable?.total_row, event?.EventTable?.total_col, event?.EventTable?.table_size)}
            </div>
          }
        </div>
        :
        <div className="flex justify-center items-center h-1/2 font-medium text-xl">Host has disabled book table feature!</div>
      }
      <Modal
        open={open}
        onClose={handleClose}
        className="flex justify-center items-center rounded-lg"
      >
        <div className="bg-white w-1/2 h-1/2 flex flex-col gap-4 justify-center items-center text-center px-4 py-4 font-josefin">
          <h2 className="text-lg font-semibold">Booking your Table...</h2>
          <div className="flex flex-col gap-1">
            <span>Row No: {bookTable?.row}</span>
            <span>Col No: {bookTable?.col}</span>
          </div>

          <form className="flex flex-col gap-3" onSubmit={handleBookTable}>
            <input
              className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-56 md:min-w-56 focus:outline-none text-lg"
              type="text"
              placeholder="Your Name"
              name="name"
            />
            <input
              className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-56 md:min-w-56 focus:outline-none text-lg"
              type="number"
              placeholder="Family Members"
              name="members"
            />
            <button type="submit" className="bg-primary-light px-2 py-1 rounded-md text-white cursor-pointer">
              Book
            </button>
          </form>
        </div>
      </Modal>
    </>
  )
}

export default BookTable
