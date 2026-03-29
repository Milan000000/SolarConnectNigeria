const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
   const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    let data;

    try {
      data = await res.json();
    } catch (err) {
      const text = await res.text();
      console.error("⚠️ Not JSON response:", text);
      throw new Error("Server returned invalid response");
    }

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    console.log("✅ Success:", data);

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

    if (!res.ok) {
      throw new Error(data.message || 'Submission failed');
    }

    // Generate WhatsApp message
    const installerText = assignedInstaller ? `%0A*Assigned Installer:* ${assignedInstaller.name}` : '';
    const message = `New Solar Quote Request!${installerText}%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Location:* ${formData.location}%0A*Property:* ${formData.propertyType}%0A*Budget:* ${formData.budget}%0A*System:* ${formData.systemType}%0A*Notes:* ${formData.notes}`;
    const whatsappUrl = `https://wa.me/2347085276095?text=${message}`;

    navigate('/thank-you', { state: { whatsappUrl } });

  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
