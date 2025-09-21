import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Building2, 
  User, 
  Calendar,
  MessageSquare,
  Edit2 
} from 'lucide-react';
import { Address } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface AddressDetailProps {
  address: Address;
  onEdit: () => void;
}

export function AddressDetail({ address, onEdit }: AddressDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            address.isBusiness ? 'bg-primary/10 text-primary' : 'bg-muted'
          }`}>
            {address.isBusiness ? <Building2 className="h-6 w-6" /> : <User className="h-6 w-6" />}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{address.name}</h3>
            {address.businessName && address.businessName !== address.name && (
              <p className="text-muted-foreground">{address.businessName}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              {address.status && (
                <Badge variant={
                  address.status === 'VIP Customer' ? 'default' :
                  address.status === 'Customer' ? 'secondary' :
                  address.status === 'Lead' ? 'outline' : 'destructive'
                }>
                  {address.status}
                </Badge>
              )}
              {address.isBusiness && (
                <Badge variant="outline">Bisnis</Badge>
              )}
              {address.hasReceivedMessage && (
                <Badge variant="secondary">Pernah Dihubungi</Badge>
              )}
            </div>
          </div>
        </div>
        <Button onClick={onEdit} size="sm">
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Kontak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{address.phoneNumber}</span>
            </div>
            
            {address.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{address.email}</span>
              </div>
            )}
            
            {address.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={address.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {address.website}
                </a>
              </div>
            )}

            {address.rating && (
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>
                  {address.rating.toFixed(1)} 
                  {address.reviews && ` (${address.reviews} reviews)`}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Lokasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p>{address.address}</p>
                {(address.city || address.state || address.country) && (
                  <p className="text-muted-foreground text-sm mt-1">
                    {[address.city, address.state, address.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
                {address.postalCode && (
                  <p className="text-muted-foreground text-sm">
                    Kode Pos: {address.postalCode}
                  </p>
                )}
              </div>
            </div>

            {(address.latitude && address.longitude) && (
              <div className="text-sm text-muted-foreground">
                Koordinat: {address.latitude}, {address.longitude}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business Information */}
        {address.isBusiness && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Bisnis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {address.businessName && (
                <div>
                  <p className="font-medium">Nama Bisnis</p>
                  <p className="text-muted-foreground">{address.businessName}</p>
                </div>
              )}
              
              {address.businessCategory && (
                <div>
                  <p className="font-medium">Kategori</p>
                  <p className="text-muted-foreground">{address.businessCategory}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Activity Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Aktivitas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span>
                Status Pesan: {address.hasReceivedMessage ? 'Pernah Dihubungi' : 'Belum Pernah'}
              </span>
            </div>

            {address.createdAt && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">
                    Dibuat: {format(new Date(address.createdAt), 'dd MMMM yyyy HH:mm', { locale: id })}
                  </p>
                  {address.updatedAt && address.updatedAt !== address.createdAt && (
                    <p className="text-sm text-muted-foreground">
                      Diperbarui: {format(new Date(address.updatedAt), 'dd MMMM yyyy HH:mm', { locale: id })}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}