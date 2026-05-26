import { useEffect, useState } from 'react';
import { grapheneSocket } from '../services/GrapheneSocket';
import { Order } from '../types';

export const useOrderStream = () => {
  const [data, setData] = useState<Order[]>([]);
  const [status, setStatus] = useState(grapheneSocket.getStatus());

  useEffect(() => {
    // 1. Connect on mount
    grapheneSocket.connect();
    setStatus('CONNECTING');

    // 2. Subscribe to the stream
    const handleUpdate = (newData: Order[]) => {
      setData(newData);
      setStatus('CONNECTED');
    };

    grapheneSocket.subscribe(handleUpdate);

    // 3. Cleanup on unmount
    return () => {
      grapheneSocket.unsubscribe(handleUpdate);
      grapheneSocket.disconnect();
      setStatus('DISCONNECTED');
    };
  }, []);

  return { data, status };
};
//Real-Time Network Ingestion Layer via a custom React hook

//This hook manages the active lifecycle of your low-latency connection within a React component. 
//It initializes the socket on mount, handles multiplexed pub/sub callbacks for incoming data arrays,
//exposes real-time connection telemetry (status), and completely cleans up its listeners and connections
//upon unmounting to preserve network resources