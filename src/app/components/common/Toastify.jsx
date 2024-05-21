
import toast from 'react-hot-toast';


  export  const ToastMessage = (props) => {
        props?.status === true ?
            toast.success(`${props?.msg}`,
                {
                    position: "top-center"

                })
            : toast.error(`${props?.msg}`,
                {
                    position: "top-center"

                })


}
 